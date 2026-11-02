import * as faceapi from 'face-api.js'

/**
 * Диагностика прокторинга: скорость запуска, темп распознавания, нагрузка на устройство.
 * Ничего не меняет в логике — только измеряет и пишет в консоль / маленькую панель на экране.
 *
 * Включить:  открыть страницу с ?proctorDebug=1 (запоминается в localStorage)
 * Выключить: ?proctorDebug=0
 * В консоли: window.__proctorMetrics — последний снимок метрик.
 */

const STORAGE_KEY = 'proctor-debug'
const REPORT_EVERY_MS = 10_000

export const isProctorDebugEnabled = () => {
  if (typeof window === 'undefined') return false

  try {
    const q = new URLSearchParams(window.location.search).get('proctorDebug')

    if (q === '1') localStorage.setItem(STORAGE_KEY, '1')
    if (q === '0') localStorage.removeItem(STORAGE_KEY)

    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export interface ProctorMetricsSnapshot {
  backend: string
  device: { cores?: number; memoryGb?: number; mobile: boolean }
  video: string
  /** мс от начала инициализации до завершения этапа */
  startup: Partial<Record<'models' | 'camera' | 'warmup' | 'ready', number>>
  warmupMs?: number
  /** размер входа детектора, выбранный калибровкой, и медиана калибровочных детекций */
  detector: { inputSize?: number; calibrationMs?: number }
  error?: string
  /** за последнее окно отчёта */
  detection: { count: number; avgMs: number; maxMs: number; avgIntervalMs: number; skippedHidden: number }
  total: { count: number; avgMs: number; maxMs: number }
  /** «зависания» главного потока > 50 мс (только Chrome/Edge) */
  longTasks: { supported: boolean; count: number; totalMs: number; maxMs: number }
  memory: { tensors: number; tensorMb: number; jsHeapMb?: number }
  uptimeSec: number
}

export interface ProctorMetrics {
  start: () => void
  step: (name: 'models' | 'camera' | 'warmup' | 'ready', durationMs?: number) => void
  setVideoTrack: (track?: MediaStreamTrack) => void
  detector: (inputSize: number, calibrationMs: number) => void
  detection: (startedAt: number, durationMs: number) => void
  skipped: () => void
  error: (code: string) => void
  stop: () => void
  subscribe: (fn: (s: ProctorMetricsSnapshot) => void) => () => void
}

const noop: ProctorMetrics = {
  start: () => {},
  step: () => {},
  setVideoTrack: () => {},
  detector: () => {},
  detection: () => {},
  skipped: () => {},
  error: () => {},
  stop: () => {},
  subscribe: () => () => {}
}

const round = (n: number) => Math.round(n)
const mb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10

export function createProctorMetrics(enabled: boolean): ProctorMetrics {
  if (!enabled) return noop

  let t0 = 0
  const startup: ProctorMetricsSnapshot['startup'] = {}
  let warmupMs: number | undefined
  const detector: ProctorMetricsSnapshot['detector'] = {}
  let error: string | undefined
  let video = '—'

  // окно отчёта
  let win = { count: 0, sum: 0, max: 0, intervalSum: 0, intervals: 0, skipped: 0 }
  const total = { count: 0, sum: 0, max: 0 }
  let lastStartedAt = 0

  const longTasks = { supported: false, count: 0, totalMs: 0, maxMs: 0 }
  let observer: PerformanceObserver | null = null
  let timer: ReturnType<typeof setInterval> | null = null
  const listeners = new Set<(s: ProctorMetricsSnapshot) => void>()

  const nav = navigator as Navigator & { deviceMemory?: number }

  const snapshot = (): ProctorMetricsSnapshot => {
    let backend = '—'
    let tensors = 0
    let tensorBytes = 0

    try {
      backend = faceapi.tf.getBackend() ?? '—'
      const m = faceapi.tf.memory()
      tensors = m.numTensors
      tensorBytes = m.numBytes
    } catch {}

    const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory

    return {
      backend,
      device: {
        cores: nav.hardwareConcurrency,
        memoryGb: nav.deviceMemory,
        mobile: /Android|iPhone|iPad|Mobile/i.test(nav.userAgent)
      },
      video,
      startup: { ...startup },
      warmupMs,
      detector: { ...detector },
      error,
      detection: {
        count: win.count,
        avgMs: win.count ? round(win.sum / win.count) : 0,
        maxMs: round(win.max),
        avgIntervalMs: win.intervals ? round(win.intervalSum / win.intervals) : 0,
        skippedHidden: win.skipped
      },
      total: {
        count: total.count,
        avgMs: total.count ? round(total.sum / total.count) : 0,
        maxMs: round(total.max)
      },
      longTasks: { ...longTasks, totalMs: round(longTasks.totalMs), maxMs: round(longTasks.maxMs) },
      memory: { tensors, tensorMb: mb(tensorBytes), jsHeapMb: heap ? mb(heap.usedJSHeapSize) : undefined },
      uptimeSec: t0 ? round((performance.now() - t0) / 1000) : 0
    }
  }

  const publish = (log: boolean) => {
    try {
      const s = snapshot()

      ;(window as unknown as { __proctorMetrics?: ProctorMetricsSnapshot }).__proctorMetrics = s
      listeners.forEach(fn => fn(s))

      if (log) {
        console.groupCollapsed(
          `[Прокторинг] ${s.backend} · детекция ~${s.detection.avgMs} мс (макс ${s.detection.maxMs}) · ` +
            `интервал ~${s.detection.avgIntervalMs} мс · зависаний ${s.longTasks.count}`
        )
        console.table({
          'Бэкенд': s.backend,
          'Размер детектора': s.detector.inputSize ?? '—',
          'Детекций за окно': s.detection.count,
          'Детекция, средн. мс': s.detection.avgMs,
          'Детекция, макс. мс': s.detection.maxMs,
          'Реальный интервал, мс': s.detection.avgIntervalMs,
          'Пропущено (вкладка скрыта)': s.detection.skippedHidden,
          'Всего детекций': s.total.count,
          'Зависаний >50мс (окно)': s.longTasks.supported ? s.longTasks.count : 'не поддерж.',
          'Зависания, сумма мс': s.longTasks.supported ? s.longTasks.totalMs : '—',
          'Тензоров': s.memory.tensors,
          'Память тензоров, МБ': s.memory.tensorMb,
          'JS heap, МБ': s.memory.jsHeapMb ?? 'не поддерж.'
        })
        console.groupEnd()
      }
    } catch {}

    // новое окно
    win = { count: 0, sum: 0, max: 0, intervalSum: 0, intervals: 0, skipped: 0 }
    longTasks.count = 0
    longTasks.totalMs = 0
    longTasks.maxMs = 0
  }

  return {
    start() {
      t0 = performance.now()

      try {
        if (PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
          longTasks.supported = true
          observer = new PerformanceObserver(list => {
            list.getEntries().forEach(e => {
              longTasks.count++
              longTasks.totalMs += e.duration
              longTasks.maxMs = Math.max(longTasks.maxMs, e.duration)
            })
          })
          observer.observe({ type: 'longtask', buffered: false })
        }
      } catch {}

      console.info('[Прокторинг] диагностика включена', {
        cores: nav.hardwareConcurrency,
        memoryGb: nav.deviceMemory,
        userAgent: nav.userAgent
      })
    },

    step(name, durationMs) {
      startup[name] = round(performance.now() - t0)
      if (name === 'warmup' && durationMs !== undefined) warmupMs = round(durationMs)

      console.info(
        `[Прокторинг] этап «${name}» через ${startup[name]} мс` + (durationMs !== undefined ? ` (сам этап ${round(durationMs)} мс)` : '')
      )

      if (name === 'ready') {
        // окно запуска (с прогревом) не смешиваем с работой
        longTasks.count = 0
        longTasks.totalMs = 0
        longTasks.maxMs = 0
        timer = setInterval(() => publish(true), REPORT_EVERY_MS)
        publish(false)
      } else {
        try {
          const s = snapshot()
          listeners.forEach(fn => fn(s))
        } catch {}
      }
    },

    setVideoTrack(track) {
      try {
        const st = track?.getSettings()
        if (st) video = `${st.width}×${st.height}${st.frameRate ? ` @${round(st.frameRate)}fps` : ''}`
      } catch {}
    },

    detector(inputSize, calibrationMs) {
      detector.inputSize = inputSize
      detector.calibrationMs = round(calibrationMs)
      console.info(`[Прокторинг] детектор ${inputSize} (калибровка ${detector.calibrationMs} мс)`)
    },

    detection(startedAt, durationMs) {
      win.count++
      win.sum += durationMs
      win.max = Math.max(win.max, durationMs)
      total.count++
      total.sum += durationMs
      total.max = Math.max(total.max, durationMs)

      if (lastStartedAt) {
        win.intervalSum += startedAt - lastStartedAt
        win.intervals++
      }
      lastStartedAt = startedAt
    },

    skipped() {
      win.skipped++
      lastStartedAt = 0 // паузу из-за скрытой вкладки не считаем интервалом
    },

    error(code) {
      error = code
      console.warn('[Прокторинг] ошибка запуска:', code, snapshot())
      listeners.forEach(fn => fn(snapshot()))
    },

    stop() {
      if (timer) clearInterval(timer)
      observer?.disconnect()
      timer = null
      observer = null
    },

    subscribe(fn) {
      listeners.add(fn)

      return () => listeners.delete(fn)
    }
  }
}
