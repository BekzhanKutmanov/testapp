'use client';

import { ProctorType } from '@/types/proctor/proctorType'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'

/* ------------------------------------------------------------------ */
/* Типы                                                                */
/* ------------------------------------------------------------------ */

export interface TestResultStats {
    /** Набранные баллы */
    score: number
    /** Максимум баллов */
    maxScore: number
    /** Правильных ответов */
    correct: number
    /** Неправильных ответов */
    incorrect: number
    /** Пропущено */
    skipped: number
}

export interface TestResultProps {
    /** Название теста — выводится вместо «Отличная работа!» */
    testTitle?: string
    /** Группа студента, например «ГД-21» */
    groupName?: string
    /** Время завершения: Date, timestamp (мс) или ISO-строка */
    finishedAt?: Date | number | string
    /** Результаты теста. Пока данных нет — используется шаблон */
    stats?: TestResultStats
    /** Данные прокторинга (из useState сейчас, из Redux позже) */
    reportData: ProctorType | null
    onViewAnswers?: () => void
    onClose?: () => void
}

/* ------------------------------------------------------------------ */
/* Шаблонные данные (пока нет реальных)                                */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_STATS: TestResultStats = {
    score: 80,
    maxScore: 100,
    correct: 16,
    incorrect: 3,
    skipped: 1
}

const PLACEHOLDER_TITLE = 'Название теста'
const PLACEHOLDER_GROUP = 'ГД-21'

/* ------------------------------------------------------------------ */
/* Утилиты                                                             */
/* ------------------------------------------------------------------ */

const formatFinishedAt = (value: Date | number | string | undefined): string => {
    const date = value === undefined ? new Date() : new Date(value)
    if (Number.isNaN(date.getTime())) return '—'

    const day = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    return `${day}, ${time}`
}

const pluralize = (n: number, one: string, few: string, many: string): string => {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return one
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
    return many
}

const honestyColor = (index: number): string => {
    if (index >= 80) return '#16A34A'
    if (index >= 50) return '#D97706'
    return '#DC2626'
}

const VIOLATION_META: Record<string, { label: string; color: string }> = {
    periodic: { label: 'Плановый снимок', color: '#64748B' },
    'looking-away': { label: 'Отвернулся', color: '#D97706' },
    'no-face': { label: 'Нет лица', color: '#C2410C' },
    'multiple-faces': { label: 'Чужое лицо', color: '#DC2626' }
}

const getViolationMeta = (type: string) =>
    VIOLATION_META[type] ?? { label: type, color: '#64748B' }

/* ------------------------------------------------------------------ */
/* Мелкие компоненты                                                   */
/* ------------------------------------------------------------------ */

interface RingProps {
    value: number
    max: number
    size: number
    stroke: number
    color: string
    trackColor: string
    children: ReactNode
}

const Ring = ({ value, max, size, stroke, color, trackColor, children }: RingProps) => {
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0

    return (
        <div className='relative shrink-0' style={{ width: size, height: size }}>
            <svg width={size} height={size} className='-rotate-90'>
                <circle cx={size / 2} cy={size / 2} r={radius} fill='none' stroke={trackColor} strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill='none'
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap='round'
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - ratio)}
                />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>{children}</div>
        </div>
    )
}

const StatCard = ({ value, label, className }: { value: number; label: string; className: string }) => (
    <div className={`flex-1 rounded-2xl px-5 py-4 ${className}`}>
        <div className='text-3xl font-bold leading-none'>{value}</div>
        <div className='mt-2 text-sm font-medium'>{label}</div>
    </div>
)

const Chip = ({ label, count }: { label: string; count: number }) => (
    <span className='rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-600'>
        {label} · <b className='font-semibold text-slate-900'>{count}</b>
    </span>
)

/* ------------------------------------------------------------------ */
/* Блок прокторинга                                                    */
/* ------------------------------------------------------------------ */

const ProctoringSection = () => {

    const proctorResult = useSelector((state) => state ? state.proctorResult.value : null);
    console.log(proctorResult);

    // Данные ещё не пришли
    if (!proctorResult) {
        return (
            <section className='mt-8 rounded-2xl bg-slate-50 p-6'>
                <div className='flex items-center gap-4'>
                    <div className='h-14 w-14 shrink-0 animate-pulse rounded-full bg-slate-200' />
                    <div className='space-y-2'>
                        <div className='h-4 w-48 animate-pulse rounded bg-slate-200' />
                        <div className='h-3 w-72 animate-pulse rounded bg-slate-200' />
                    </div>
                </div>
                <p className='mt-4 text-sm text-slate-500'>Отчёт прокторинга загружается…</p>
            </section>
        )
    }

    const stats = proctorResult?.stats;
    const gallery = proctorResult?.gallery;

    const color = honestyColor(stats?.honestyIndex)

    return (
        <section className='mt-8 rounded-2xl bg-slate-50 p-6'>
            {/* Индекс честности */}
            <div className='flex items-center gap-4'>
                <Ring value={stats?.honestyIndex} max={100} size={56} stroke={6} color={color} trackColor='#E2E8F0'>
                    <span className='text-base font-bold text-slate-900'>{stats.honestyIndex}</span>
                </Ring>
                <div>
                    <h3 className='text-base font-semibold text-slate-900'>Честность прохождения</h3>
                    <p className='mt-0.5 text-sm text-slate-500'>
                        {stats.totalViolations > 0
                            ? `Отмечено ${stats.totalViolations} ${pluralize(stats.totalViolations, 'момент', 'момента', 'моментов')}. Это не влияет на баллы за тест.`
                            : 'Нарушений не зафиксировано.'}
                    </p>
                </div>
            </div>

            {/* Счётчики */}
            <div className='mt-5 flex flex-wrap gap-2'>
                <Chip label='Отворачивался' count={stats.lookingAwayCount} />
                <Chip label='Пропадал из кадра' count={stats.noFaceCount} />
                <Chip label='Посторонние в кадре' count={stats.multipleFacesCount} />
            </div>

            {/* Галерея — видна всегда */}
            <div className='mt-6'>
                <div className='mb-3 text-sm font-medium text-slate-700'>
                    Снимки <span className='text-slate-400'>({gallery.length})</span>
                </div>

                {gallery.length > 0 ? (
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                        {gallery.map((item, i) => {
                            const meta = getViolationMeta(item.type)
                            return (
                                <figure
                                    key={`${item.timestamp}-${i}`}
                                    className='overflow-hidden rounded-xl border border-slate-200 bg-white'
                                >
                                    <img src={item.url} alt={meta.label} loading='lazy' className='aspect-video w-full object-cover' />
                                    <figcaption className='flex items-center justify-between gap-2 px-2.5 py-2'>
                                        <span className='text-[11px] font-semibold' style={{ color: meta.color }}>
                                            {meta.label}
                                        </span>
                                        <span className='text-[11px] tabular-nums text-slate-400'>
                                            {new Date(item.timestamp).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </figcaption>
                                </figure>
                            )
                        })}
                    </div>
                ) : (
                    <div className='rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500'>
                        Снимков нет
                    </div>
                )}
            </div>
        </section>
    )
}

/* ------------------------------------------------------------------ */
/* Основной компонент                                                  */
/* ------------------------------------------------------------------ */

export const TestResult = ({
    testTitle = PLACEHOLDER_TITLE,
    groupName = PLACEHOLDER_GROUP,
    finishedAt,
    stats = PLACEHOLDER_STATS,
    reportData,
    onViewAnswers,
    onClose
}: TestResultProps) => {
    const total = stats.correct + stats.incorrect + stats.skipped
    const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0)

    return (
        <div className='mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60'>
            {/* Заголовок */}
            <header>
                <span className='text-xs font-semibold uppercase tracking-wider text-indigo-600'>Результаты теста</span>
                <h1 className='mt-2 text-3xl font-extrabold text-slate-900'>{testTitle}</h1>
                <p className='mt-3 text-sm text-slate-500'>
                    Группа {groupName} · завершён {formatFinishedAt(finishedAt)}
                </p>
            </header>

            {/* Баллы и ответы */}
            <div className='mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-center'>
                <Ring
                    value={stats.score}
                    max={stats.maxScore}
                    size={168}
                    stroke={16}
                    color='#4F46E5'
                    trackColor='#E0E7FF'
                >
                    <span className='text-5xl font-extrabold leading-none text-slate-900'>{stats.score}</span>
                    <span className='mt-1 text-xs text-slate-500'>из {stats.maxScore} баллов</span>
                </Ring>

                <div className='w-full flex-1'>
                    <div className='flex gap-3 flex-wrap'>
                        <StatCard value={stats.correct} label='Правильно' className='bg-emerald-50 text-emerald-700' />
                        <StatCard value={stats.incorrect} label='Неправильно' className='bg-rose-50 text-rose-700' />
                        <StatCard value={stats.skipped} label='Пропущено' className='bg-slate-100 text-slate-600' />
                    </div>

                    <div className='mt-4 flex h-2 overflow-hidden rounded-full bg-slate-200'>
                        <div className='bg-green-500' style={{ width: `${pct(stats.correct)}%` }} />
                        <div className='bg-red-500' style={{ width: `${pct(stats.incorrect)}%` }} />
                    </div>

                    <p className='mt-3 text-sm text-slate-500'>
                        Верно отвечено на {stats.correct} из {total}{' '}
                        {pluralize(total, 'вопроса', 'вопросов', 'вопросов')}
                    </p>
                </div>
            </div>

            {/* Кнопки (пока без действий) */}
            <div className='mt-8 flex flex-wrap gap-3'>
                <button
                    type='button'
                    onClick={onViewAnswers}
                    className='rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                    Посмотреть ответы
                </button>
                <button
                    type='button'
                    onClick={onClose}
                    className='rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400'
                >
                    Закрыть
                </button>
            </div>

            {/* Прокторинг */}
            <ProctoringSection />
        </div>
    )
}

export default TestResult

/* ------------------------------------------------------------------ */
/* Пример использования                                                */
/* ------------------------------------------------------------------ */
/*
const [reportData, setReportData] = useState<ProctorType | null>(null)

<TestResult reportData={reportData} />

// Позже, когда появятся данные:
<TestResult
  testTitle={test.title}
  groupName={student.group}
  finishedAt={result.finishedAt}
  stats={{ score: 80, maxScore: 100, correct: 16, incorrect: 3, skipped: 1 }}
  reportData={useSelector(selectProctorReport)}
  onViewAnswers={() => navigate('/answers')}
  onClose={() => navigate('/')}
/>
*/
