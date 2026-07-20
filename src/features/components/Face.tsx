'use client'

import { useRef, useState, useEffect } from 'react'

import * as faceapi from 'face-api.js'
import { enqueueSnackbar } from 'notistack'

import { startTabTracking } from '@/features/utils_/startTabTracking'

interface ProctorCameraProps {
  onFacesDetected: (count: number) => void
  onMatchResult: (result: string) => void
  onLookingAway: (away: boolean) => void
  facesDetected: number
  matchResult: string
  isLookingAway: boolean
}

export function ProctorCamera({
  onFacesDetected,
  onMatchResult,
  onLookingAway,
  facesDetected,
  matchResult,
  isLookingAway
}: ProctorCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const violationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noFaceCriticalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noFaceCriticalShownRef = useRef(false)
  const pendingViolationRef = useRef<'no-face' | 'looking-away' | null>(null)

  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const screenshotsRef = useRef<{blob: Blob, timestamp: number, type: 'periodic' | 'no-face' | 'looking-away' | 'multiple-faces' }[]>([])

  const lastViolationTypeRef = useRef<'no-face' | 'looking-away' | 'multiple-faces' | null>(null)
  const periodicIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [testFinished, setTestFinished] = useState(false)
  const streamRef = useRef<MediaStream | null>(null) // понадобится, чтобы остановить камеру по кнопке, а не только на unmount

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const PENALTY_PER_VIOLATION = 5

  const [reportData, setReportData] = useState<{
    gallery: Array<{ url: string; timestamp: number; type: string }>
    stats: {
      lookingAwayCount: number
      noFaceCount: number
      multipleFacesCount: number
      totalViolations: number
      honestyIndex: number
    }
  } | null>(null)

  // const { enqueueSnackbar } = useSnackbar();

  // Синхронизируем descriptor в ref чтобы checkFace всегда видел актуальный
  // useEffect(() => {
  //   descriptorRef.current = descriptor
  // }, [descriptor])

  // Единственный useEffect — инициализация. Запускается один раз.
  const clearPendingViolation = () => {
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current)
      violationTimeoutRef.current = null
    }

    pendingViolationRef.current = null
  }

  const scheduleViolation = (type: 'no-face' | 'looking-away', callback: () => void) => {
    if (pendingViolationRef.current === type) return

    clearPendingViolation()
    pendingViolationRef.current = type
    violationTimeoutRef.current = setTimeout(() => {
      if (pendingViolationRef.current !== type) return

      violationTimeoutRef.current = null
      pendingViolationRef.current = null
      callback()
    }, 3000)
  }

  const clearNoFaceCriticalViolation = () => {
    if (noFaceCriticalTimeoutRef.current) {
      clearTimeout(noFaceCriticalTimeoutRef.current)
      noFaceCriticalTimeoutRef.current = null
    }

    noFaceCriticalShownRef.current = false
  }

  const scheduleNoFaceCriticalViolation = () => {
    if (noFaceCriticalTimeoutRef.current || noFaceCriticalShownRef.current) return

    noFaceCriticalTimeoutRef.current = setTimeout(() => {
      noFaceCriticalTimeoutRef.current = null
      noFaceCriticalShownRef.current = true

      // Теперь это будет работать без ошибок
      enqueueSnackbar('Критическое нарушение: пользователь отсутствовал в камере целую минуту. Балл будет снижен.', {
        variant: 'error'
      })
    }, 60000)
  }

  // screen
  const captureScreenshot = (type: 'periodic' | 'no-face' | 'looking-away' | 'multiple-faces') => {
    const video = videoRef.current
    if (!video || video.readyState < 2 || video.videoWidth === 0) return

    let canvas = captureCanvasRef.current
    if (!canvas) {
      canvas = document.createElement('canvas')
      captureCanvasRef.current = canvas
    }

    // Даунскейл — не храним кадры в полном разрешении камеры, это лишняя память
    const MAX_WIDTH = 480
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
    canvas.width = video.videoWidth * scale
    canvas.height = video.videoHeight * scale

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      blob => {
        if (!blob) return
        const item = { blob, timestamp: Date.now(), type }
        screenshotsRef.current.push(item)
      },
      'image/jpeg',
      0.7
    )
  }

  const maybeCaptureViolation = (type: 'no-face' | 'looking-away' | 'multiple-faces') => {
    if (lastViolationTypeRef.current === type) return
    lastViolationTypeRef.current = type
    captureScreenshot(type)
  }

  const clearViolationCapture = () => {
    lastViolationTypeRef.current = null
  }

  const stopCameraProctoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (periodicIntervalRef.current) clearInterval(periodicIntervalRef.current)
    clearPendingViolation()
    clearNoFaceCriticalViolation()

    const stream = streamRef.current
    stream?.getTracks().forEach(t => t.stop())
  }

  const buildReport = () => {
    const items = screenshotsRef.current

    const gallery = items.map(item => ({
      url: URL.createObjectURL(item.blob),
      timestamp: item.timestamp,
      type: item.type
    }))

    const lookingAwayCount = items.filter(i => i.type === 'looking-away').length
    const noFaceCount = items.filter(i => i.type === 'no-face').length
    const multipleFacesCount = items.filter(i => i.type === 'multiple-faces').length
    const totalViolations = lookingAwayCount + noFaceCount + multipleFacesCount

    const honestyIndex = Math.max(0, 100 - totalViolations * PENALTY_PER_VIOLATION)

    setReportData({
      gallery,
      stats: { lookingAwayCount, noFaceCount, multipleFacesCount, totalViolations, honestyIndex }
    })
  }

  const handleFinishTest = () => {
    stopCameraProctoring()
    buildReport()
    setTestFinished(true)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const init = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        // await faceapi.nets.faceRecognitionNet.loadFromUri('/models')

        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream

        if (cancelled) {
          // ← добавляем проверку
          stream.getTracks().forEach(t => t.stop())
          return
        }

        video.srcObject = stream

        // Ждём пока видео реально готово
        await new Promise<void>(resolve => {
          const onReady = () => {
            video.removeEventListener('canplay', onReady)
            resolve()
          }
          if (video.readyState >= 3) {
            resolve()
            return
          }
          video.addEventListener('canplay', onReady)
        })

        await video.play()
        setLoading(false)

        // Запускаем детекцию — она работает ВСЕГДА независимо от панели
        intervalRef.current = setInterval(async () => {
          if (video.readyState < 2 || video.videoWidth === 0) return

          try {
            const allDetections = await faceapi.detectAllFaces(video).withFaceLandmarks()
            // .withFaceDescriptors()

            if (!allDetections || allDetections.length === 0) {
              scheduleNoFaceCriticalViolation()
              scheduleViolation('no-face', () => {
                onFacesDetected(0)
                onMatchResult('Лицо не найдено')
                onLookingAway(false)
                maybeCaptureViolation('no-face')
              })
              return
            }

            clearNoFaceCriticalViolation()
            // clearViolationCapture()
            onFacesDetected(allDetections.length)

            if (allDetections.length > 1) {
              clearPendingViolation()
              onLookingAway(false)
              maybeCaptureViolation('multiple-faces')
              return
            }

            // clearViolationCapture()

            const detection = allDetections[0]
            const positions = detection.landmarks.positions

            const leftCheek = positions[0]
            const rightCheek = positions[16]
            const noseTip = positions[30]

            const distanceToLeft = Math.abs(noseTip.x - leftCheek.x)
            const distanceToRight = Math.abs(rightCheek.x - noseTip.x)
            const ratio = distanceToLeft / distanceToRight

            if (ratio < 0.5 || ratio > 2.0) {
              scheduleViolation('looking-away', () => {
                onLookingAway(true)
                maybeCaptureViolation('looking-away')
              })
            } else {
              clearPendingViolation()
              onLookingAway(false)
              clearViolationCapture()
            }

            // const currentDescriptor = descriptorRef.current
            // if (currentDescriptor && detection.descriptor) {
            //   const faceMatcher = new faceapi.FaceMatcher(
            //     new faceapi.LabeledFaceDescriptors('UploadedFace', [new Float32Array(currentDescriptor)]),
            //     0.6
            //   )
            //   const bestMatch = faceMatcher.findBestMatch(detection.descriptor)
            //   onMatchResult(bestMatch.label === 'unknown' ? 'Не совпадает' : 'Совпадает')
            // } else {
            //   onMatchResult('Ожидание фото...')
            // }
          } catch (_) {
            // игнорируем единичные ошибки детекции
          }
        }, 1000)

        periodicIntervalRef.current = setInterval(() => {
          captureScreenshot('periodic')
        }, 60000)
      } catch (err) {
        console.error('Ошибка инициализации:', err)
      }
    }

    init()

    return () => {
      // if (intervalRef.current) clearInterval(intervalRef.current)
      // if (periodicIntervalRef.current) clearInterval(periodicIntervalRef.current)
      // clearPendingViolation()
      // clearNoFaceCriticalViolation()
      // const s = video.srcObject as MediaStream | null
      // s?.getTracks().forEach(t => t.stop())
      cancelled = true
      stopCameraProctoring()
    }
  }, []) // [] — только при монтировании, больше никогда

  // Защита навигации
  useEffect(() => {
    // Для перезагрузки и закрытия вкладки
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    // Перехватываем Next.js внутренние переходы
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')

      if (!link) return

      const href = link.getAttribute('href')

      if (!href || href === window.location.pathname) return

      e.preventDefault()
      const ok = window.confirm('Вы уверены, что хотите выйти?')
      if (ok) window.location.href = href
    }

    // === ПОДКЛЮЧАЕМ ПРОКТОРИНГ ===
    const stopProctoring = startTabTracking() // Запускаем и сохраняем функцию очистки

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleClick, true) // true = capture phase

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleClick, true)

      stopProctoring()
    }
  }, [])

  useEffect(() => {
    return () => {
      reportData?.gallery.forEach(item => URL.revokeObjectURL(item.url))
    }
  }, [reportData])

  const statusColor = isLookingAway ? '#EF4444' : facesDetected === 0 ? '#F59E0B' : '#22C55E'
  const statusText = isLookingAway ? 'Отвернулся' : facesDetected === 0 ? 'Нет лица' : 'Наблюдение активно'
  const triggerText = loading ? 'Инициализация камеры...' : statusText

  return (
    <>
      <style>{`
        .proctor-panel {
          position: fixed; left: 0; bottom: 0; top: 0; width: 320px; z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          height: 450px;
          display: flex; flex-direction: column;
          background: #0D0F14; border-right: 1px solid rgba(255,255,255,0.08);
          box-shadow: 4px 0 32px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif;
        }
        .proctor-panel.open { transform: translateX(0); }
        .proctor-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .proctor-title-row { display: flex; align-items: center; gap: 8px; }
        .proctor-rec-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #EF4444;
          animation: blink 1.2s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        .proctor-label {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; color: #EF4444; text-transform: uppercase;
        }
        .proctor-close-btn {
          background: rgba(255,255,255,0.06); border: none; color: #94A3B8;
          width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s; font-size: 16px; line-height: 1;
        }
        .proctor-close-btn:hover { background: rgba(255,255,255,0.12); color: #E2E8F0; }

        /* Видео всегда в DOM, просто скрыто когда панель закрыта */
        .proctor-video-wrap {
          position: relative; margin: 16px; border-radius: 12px;
          overflow: hidden; background: #000; aspect-ratio: 4/3;
        }
        .proctor-video {
          width: 100%; height: 100%; object-fit: cover; display: block; transform: scaleX(-1);
        }
        .proctor-video-overlay { position: absolute; inset: 0; pointer-events: none; }
        .proctor-corner {
          position: absolute; width: 16px; height: 16px;
          border-color: #3B82F6; border-style: solid; opacity: 0.7;
        }
        .proctor-corner.tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; border-radius: 2px 0 0 0; }
        .proctor-corner.tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; border-radius: 0 2px 0 0; }
        .proctor-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; border-radius: 0 0 0 2px; }
        .proctor-corner.br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; border-radius: 0 0 2px 0; }
        .proctor-status-badge {
          position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
          padding: 4px 12px; border-radius: 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
          transition: background 0.3s, color 0.3s;
        }
        .proctor-stats { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .stat-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; background: rgba(255,255,255,0.04);
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-key { font-size: 11px; color: #64748B; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }
        .stat-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; }
        .proctor-alert {
          margin: 0 16px 16px; padding: 10px 12px; border-radius: 8px;
          display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; transition: all 0.3s;
        }
        .proctor-alert.danger { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #FCA5A5; }
        .proctor-alert.ok { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86EFAC; }
        .proctor-alert.warning { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #FCD34D; }
        .proctor-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px; color: #475569; font-size: 13px;
        }
        .proctor-spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(59,130,246,0.2); border-top-color: #3B82F6;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .proctor-trigger {
          position: fixed; left: 16px; bottom: 24px; z-index: 999;
          display: flex; align-items: center; gap: 8px;
          padding: 9px 20px 9px 14px; background: #0D0F14;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 99px;
          cursor: pointer; color: #94A3B8; font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .proctor-trigger:hover { border-color: rgba(59,130,246,0.4); color: #E2E8F0; background: #161920; }
        .proctor-trigger.active { border-color: rgba(59,130,246,0.5); color: #93C5FD; }
        .trigger-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; transition: background 0.3s; }
        .proctor-trigger-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .proctor-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; }
        @media (max-width: 640px) {
          .proctor-panel {
            width: 100%; top: auto; height: 75vh; border-right: none;
            border-top: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px 20px 0 0; transform: translateY(100%);
            box-shadow: 0 -8px 40px rgba(0,0,0,0.6);
          }
          .proctor-panel.open { transform: translateY(0); }
          .proctor-trigger { bottom: 20px; left: 50%; transform: translateX(-50%); }
          .proctor-backdrop { display: block; }
          .proctor-backdrop.hidden { display: none; }
          .proctor-video-wrap { aspect-ratio: 16/9; }
        }
      `}</style>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ position: 'fixed', visibility: 'hidden', pointerEvents: 'none', width: 1, height: 1, top: 0, left: 0 }}
      />

      {testFinished ? (
        <div className='fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/80 p-6 backdrop-blur-sm'>
          <div className='my-8 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl'>
            {/* Заголовок */}
            <div className='border-b border-slate-800 px-8 py-6'>
              <span className='text-xs font-medium uppercase tracking-wider text-slate-500'>Отчёт прокторинга</span>
              <h2 className='mt-1 text-xl font-semibold text-slate-100'>Тест завершён</h2>
            </div>

            {/* Индекс честности */}
            <div className='flex items-center gap-6 border-b border-slate-800 px-8 py-6'>
              <div
                className='flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 text-2xl font-bold'
                style={{
                  borderColor:
                    (reportData?.stats.honestyIndex ?? 0) >= 80
                      ? '#22C55E'
                      : (reportData?.stats.honestyIndex ?? 0) >= 50
                        ? '#F59E0B'
                        : '#EF4444',
                  color:
                    (reportData?.stats.honestyIndex ?? 0) >= 80
                      ? '#22C55E'
                      : (reportData?.stats.honestyIndex ?? 0) >= 50
                        ? '#F59E0B'
                        : '#EF4444'
                }}
              >
                {reportData?.stats.honestyIndex ?? 0}
              </div>
              <div>
                <div className='text-sm font-medium text-slate-200'>Индекс честности</div>
                <div className='mt-0.5 text-sm text-slate-500'>
                  Рассчитан по количеству и типу зафиксированных нарушений
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className='grid grid-cols-3 gap-px border-b border-slate-800 bg-slate-800'>
              <div className='bg-slate-900 px-6 py-5 text-center'>
                <div className='text-2xl font-semibold text-slate-100'>{reportData?.stats.lookingAwayCount ?? 0}</div>
                <div className='mt-1 text-xs text-slate-500'>Отворачивался</div>
              </div>
              <div className='bg-slate-900 px-6 py-5 text-center'>
                <div className='text-2xl font-semibold text-slate-100'>{reportData?.stats.noFaceCount ?? 0}</div>
                <div className='mt-1 text-xs text-slate-500'>Пропадал из кадра</div>
              </div>
              <div className='bg-slate-900 px-6 py-5 text-center'>
                <div className='text-2xl font-semibold text-slate-100'>{reportData?.stats.multipleFacesCount ?? 0}</div>
                <div className='mt-1 text-xs text-slate-500'>Посторонние в кадре</div>
              </div>
            </div>

            {/* Галерея */}
            <div className='px-8 py-6'>
              <div className='mb-4 text-sm font-medium text-slate-300'>
                Галерея нарушений
                <span className='ml-2 text-slate-500'>({reportData?.gallery.length ?? 0})</span>
              </div>

              {reportData?.gallery.length ? (
                <div className='grid grid-cols-3 gap-3'>
                  {reportData.gallery.map((item, i) => (
                    <div key={i} className='overflow-hidden rounded-lg border border-slate-800 bg-slate-950'>
                      <img src={item.url} alt={item.type} className='aspect-video w-full object-cover' />
                      <div className='flex items-center justify-between px-2.5 py-2'>
                        <span
                          className='text-[11px] font-medium'
                          style={{
                            color:
                              item.type === 'periodic'
                                ? '#64748B'
                                : item.type === 'looking-away'
                                  ? '#F59E0B'
                                  : '#EF4444'
                          }}
                        >
                          {item.type === 'looking-away'
                            ? 'Отвернулся'
                            : item.type === 'no-face'
                              ? 'Нет лица'
                              : item.type === 'multiple-faces'
                                ? 'Чужое лицо'
                                : 'Плановый снимок'}
                        </span>
                        <span className='text-[11px] text-slate-600'>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-lg border border-dashed border-slate-800 py-8 text-center text-sm text-slate-500'>
                  Нарушений не зафиксировано
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`proctor-backdrop ${isOpen ? '' : 'hidden'}`} onClick={() => setIsOpen(false)} />

          <aside className={`proctor-panel ${isOpen ? 'open' : ''}`}>
            <div className='proctor-header'>
              <div className='proctor-title-row'>
                <div className='proctor-rec-dot' />
                <span className='proctor-label'>Прокторинг</span>
              </div>
              <button className='proctor-close-btn' onClick={() => setIsOpen(false)} aria-label='Скрыть камеру'>
                ✕
              </button>
            </div>

            {loading ? (
              <div className='proctor-loading'>
                <div className='proctor-spinner' />
                <span>Инициализация камеры…</span>
              </div>
            ) : (
              <>
                {/* В панели показываем тот же стрим через отдельный элемент */}
                <div className='proctor-video-wrap'>
                  <video
                    className='proctor-video'
                    autoPlay
                    muted
                    playsInline
                    ref={el => {
                      if (el && videoRef.current?.srcObject) {
                        el.srcObject = videoRef.current.srcObject
                      }
                    }}
                  />
                  <div className='proctor-video-overlay'>
                    <div className='proctor-corner tl' />
                    <div className='proctor-corner tr' />
                    <div className='proctor-corner bl' />
                    <div className='proctor-corner br' />
                    <div
                      className='proctor-status-badge'
                      style={{
                        background: `${statusColor}22`,
                        color: statusColor,
                        border: `1px solid ${statusColor}55`
                      }}
                    >
                      {statusText}
                    </div>
                  </div>
                </div>

                <div className='proctor-stats'>
                  <div className='stat-row'>
                    <span className='stat-key'>Лиц в кадре</span>
                    <span
                      className='stat-val'
                      style={{ color: facesDetected === 1 ? '#22C55E' : facesDetected === 0 ? '#F59E0B' : '#EF4444' }}
                    >
                      {facesDetected}
                    </span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-key'>Идентификация</span>
                    <span
                      className='stat-val'
                      style={{
                        color:
                          matchResult === 'Совпадает'
                            ? '#22C55E'
                            : matchResult === 'Не совпадает'
                              ? '#EF4444'
                              : '#64748B'
                      }}
                    >
                      {matchResult || '—'}
                    </span>
                  </div>
                </div>

                <div className={`proctor-alert ${isLookingAway ? 'danger' : facesDetected === 0 ? 'warning' : 'ok'}`}>
                  <span style={{ fontSize: 16 }}>{isLookingAway ? '⚠️' : facesDetected === 0 ? '👁️' : '✓'}</span>
                  <span>
                    {isLookingAway
                      ? 'Студент отвернулся от экрана'
                      : facesDetected === 0
                        ? 'Лицо не обнаружено в кадре'
                        : 'Студент смотрит на экран'}
                  </span>
                </div>
              </>
            )}
          </aside>

          <button
            className={`proctor-trigger ${isOpen ? 'active' : ''} py-3`}
            onClick={() => setIsOpen(v => !v)}
            aria-label='Показать камеру прокторинга'
          >
            <div className='trigger-dot' style={{ background: loading ? '#475569' : statusColor }} />
            <svg
              className='proctor-trigger-icon'
              viewBox='0 0 20 20'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path d='M2 6.5A1.5 1.5 0 013.5 5h9A1.5 1.5 0 0114 6.5v7A1.5 1.5 0 0112.5 15h-9A1.5 1.5 0 012 13.5v-7z' />
              <path d='M14 8.5l4-2v7l-4-2' />
            </svg>
            <b className={'font-bold text-md'}>{triggerText}</b>
          </button>

          {!loading && (
            <button className='proctor-finish-btn-fixed' onClick={handleFinishTest}>
              Завершить тест
            </button>
          )}
        </>
      )}
    </>
  )
}
