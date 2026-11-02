'use client'

import { useEffect, useRef, useState } from 'react'

import { ButtonBase, Tooltip } from '@mui/material'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

import { type NavigatorItem } from '@/shared/ui/question-navigator/QuestionNavigator'

export interface CreateTestNavigatorItem extends NavigatorItem {
  /** Краткий текст вопроса (без HTML) для режима «Список» */
  preview: string
}

interface CreateTestNavigatorProps {
  items: CreateTestNavigatorItem[]
  onSelect: (id: string) => void
  onAddQuestion?: () => void
}

type ViewMode = 'grid' | 'list'
type Filter = 'all' | 'incomplete'

const MOBILE_BREAKPOINT = 600 // совпадает с брейкпоинтом sm в tailwind

const RING_SIZE = 64
const RING_STROKE = 4
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/**
 * Навигатор по вопросам на странице создания теста.
 * Кнопка в правом нижнем углу показывает прогресс заполнения;
 * по клику открывается панель (на телефоне — нижняя шторка) со списком вопросов.
 */
export default function CreateTestNavigator({ items, onSelect, onAddQuestion }: CreateTestNavigatorProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<Filter>('all')
  const [currentId, setCurrentId] = useState<string | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const pendingScrollToNew = useRef(false)
  const prevCount = useRef(items.length)

  const total = items.length
  const completedCount = items.filter(i => i.answered).length
  const incompleteCount = total - completedCount
  const progress = total ? completedCount / total : 0
  const allDone = total > 0 && incompleteCount === 0

  const visibleItems = items
    .map((item, index) => ({ ...item, index }))
    .filter(item => filter === 'all' || !item.answered)

  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT

  // Закрываем по клику вне панели (только десктоп — на телефоне есть подложка) и по Escape
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (isMobile()) return
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Блокируем прокрутку страницы, пока открыта нижняя шторка на телефоне
  useEffect(() => {
    if (!open || !isMobile()) return

    const prev = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Определяем вопрос, который сейчас в центре экрана
  const idsKey = items.map(i => i.id).join('|')

  useEffect(() => {
    const elements = items
      .map(i => document.getElementById(`question-${i.id}`))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting)

        if (visible) setCurrentId(visible.target.id.replace(/^question-/, ''))
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  // После добавления вопроса через панель — прокручиваем к нему
  useEffect(() => {
    if (pendingScrollToNew.current && items.length > prevCount.current) {
      pendingScrollToNew.current = false
      const last = items[items.length - 1]

      // ждём, пока карточка отрисуется
      requestAnimationFrame(() => onSelect(last.id))
    }

    prevCount.current = items.length
  }, [items, onSelect])

  const handleSelect = (id: string) => {
    onSelect(id)
    if (isMobile()) setOpen(false)
  }

  const handleAdd = () => {
    if (!onAddQuestion) return
    pendingScrollToNew.current = true
    onAddQuestion()
    if (isMobile()) setOpen(false)
  }

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (isMobile()) setOpen(false)
  }

  const statusClasses = (answered: boolean) =>
    answered
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      // : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
      : 'border-red-200 bg-red-100 text-red-600 hover:bg-red-100'

  const segmentBtn = (active: boolean) =>
    `flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
      active ? 'bg-backgroundPaper text-primary shadow-sm' : 'text-textSecondary hover:text-textPrimary'
    }`

  return (
    <>
      {/* Подложка для мобильной шторки */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[1199] bg-black/40 transition-opacity duration-300 sm:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      />

      <div ref={rootRef} className='fixed bottom-4 right-4 z-[1200] flex flex-col items-end sm:bottom-8 sm:right-8'>
        {/* Панель */}
        <div
          id='create-test-navigator-panel'
          role='dialog'
          aria-label='Навигация по вопросам'
          className={`fixed inset-x-0 bottom-0 flex max-h-[80vh] flex-col overflow-hidden rounded-t-3xl border border-solid bg-backgroundPaper shadow-2xl transition-all duration-300 ease-out sm:absolute sm:inset-x-auto sm:bottom-[84px] sm:right-0 sm:max-h-[70vh] sm:w-[340px] sm:origin-bottom-right sm:rounded-2xl ${
            open
              ? 'visible translate-y-0 opacity-100 sm:scale-100'
              : 'invisible translate-y-full opacity-0 sm:translate-y-2 sm:scale-95'
          }`}
        >
          {/* «Ручка» шторки на телефоне */}
          <div className='flex justify-center pt-2 sm:hidden'>
            <span className='h-1 w-10 rounded-full bg-textDisabled' />
          </div>

          {/* Шапка */}
          <div className='px-4 pb-3 pt-3 sm:pt-4'>
            <div className='flex items-center justify-between gap-2'>
              <div>
                <p className='m-0 text-base font-bold text-textPrimary'>Вопросы</p>
                <p className='m-0 mt-0.5 text-xs text-textSecondary'>
                  Заполнено <span className='font-semibold text-textPrimary'>{completedCount}</span> из {total}
                </p>
              </div>
              <ButtonBase
                onClick={() => setOpen(false)}
                aria-label='Закрыть'
                className='flex h-8 w-8 items-center justify-center rounded-full text-textSecondary hover:bg-actionHover'
              >
                <CloseRoundedIcon fontSize='small' />
              </ButtonBase>
            </div>

            {/* Прогресс */}
            <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-actionHover'>
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Фильтр и вид */}
            <div className='mt-3 flex items-center gap-2'>
              <div className='flex flex-1 gap-1 rounded-lg bg-actionHover p-1'>
                <ButtonBase onClick={() => setFilter('all')} className={segmentBtn(filter === 'all')}>
                  Все · {total}
                </ButtonBase>
                <ButtonBase onClick={() => setFilter('incomplete')} className={segmentBtn(filter === 'incomplete')}>
                  Незаполненные · {incompleteCount}
                </ButtonBase>
              </div>
              <div className='flex gap-1 rounded-lg bg-actionHover p-1'>
                <Tooltip title='Сетка'>
                  <ButtonBase
                    onClick={() => setView('grid')}
                    aria-label='Показать сеткой'
                    className={`${segmentBtn(view === 'grid')} !flex-none !px-1.5`}
                  >
                    <GridViewRoundedIcon sx={{ fontSize: 16 }} />
                  </ButtonBase>
                </Tooltip>
                <Tooltip title='Список'>
                  <ButtonBase
                    onClick={() => setView('list')}
                    aria-label='Показать списком'
                    className={`${segmentBtn(view === 'list')} !flex-none !px-1.5`}
                  >
                    <ViewListRoundedIcon sx={{ fontSize: 16 }} />
                  </ButtonBase>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Содержимое */}
          <div className='min-h-[80px] flex-1 overflow-y-auto border-0 border-t border-solid px-4 py-3'>
            {visibleItems.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-6 text-center'>
                <span className='text-2xl'>🎉</span>
                <p className='m-0 mt-2 text-sm font-semibold text-textPrimary'>Все вопросы заполнены</p>
                <p className='m-0 mt-1 text-xs text-textSecondary'>Можно сохранять тест</p>
              </div>
            ) : view === 'grid' ? (
              <div className='grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-2'>
                {visibleItems.map(item => {
                  const isCurrent = item.id === currentId

                  return (
                    <Tooltip key={item.id} title={item.preview || 'Без текста'} placement='top' arrow enterDelay={400}>
                      <ButtonBase
                        onClick={() => handleSelect(item.id)}
                        aria-label={`Вопрос ${item.index + 1}: ${item.answered ? 'заполнен' : 'не заполнен'}`}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={`h-11 rounded-xl border border-solid text-sm font-semibold transition-all duration-200 ${statusClasses(
                          item.answered
                        )} ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      >
                        {item.index + 1}
                      </ButtonBase>
                    </Tooltip>
                  )
                })}
              </div>
            ) : (
              <ul className='m-0 flex list-none flex-col gap-1 p-0'>
                {visibleItems.map(item => {
                  const isCurrent = item.id === currentId

                  return (
                    <li key={item.id}>
                      <ButtonBase
                        onClick={() => handleSelect(item.id)}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={`flex w-full items-center justify-start gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                          isCurrent ? 'bg-primaryLighter' : 'hover:bg-actionHover'
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-solid text-xs font-bold ${statusClasses(
                            item.answered
                          )}`}
                        >
                          {item.index + 1}
                        </span>
                        <span className='min-w-0 flex-1'>
                          <span
                            className={`block truncate text-sm ${
                              item.preview ? 'text-textPrimary' : 'italic text-textDisabled'
                            }`}
                          >
                            {item.preview || 'Без текста'}
                          </span>
                          <span className={`block text-[11px] ${item.answered ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.answered ? 'Заполнен' : 'Не заполнен'}
                          </span>
                        </span>
                      </ButtonBase>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Легенда и действия */}
          <div className='border-0 border-t border-solid px-4 py-3'>
            <div className='mb-3 flex items-center gap-4 text-[11px] text-textSecondary'>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-emerald-400' /> Заполнен
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-amber-400' /> Не заполнен
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-full ring-2 ring-primary' /> Текущий
              </span>
            </div>
            <div className='flex gap-2'>
              <ButtonBase
                onClick={handleScrollTop}
                className='flex flex-1 items-center justify-center gap-1 rounded-lg border border-solid py-2 text-xs font-semibold text-textSecondary hover:bg-actionHover'
              >
                <VerticalAlignTopRoundedIcon sx={{ fontSize: 16 }} /> В начало
              </ButtonBase>
              {onAddQuestion && (
                <ButtonBase
                  onClick={handleAdd}
                  className='flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:opacity-90'
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} /> Новый вопрос
                </ButtonBase>
              )}
            </div>
          </div>
        </div>

        {/* Кнопка с кольцом прогресса */}
        <Tooltip title={open ? '' : 'Навигация по вопросам'} placement='left' arrow>
          <ButtonBase
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Скрыть навигацию по вопросам' : 'Показать навигацию по вопросам'}
            aria-expanded={open}
            aria-controls='create-test-navigator-panel'
            className={`relative h-14 w-14 rounded-full transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16 ${
              open ? 'max-sm:invisible max-sm:scale-75 max-sm:opacity-0' : ''
            }`}
          >
            <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className='absolute inset-0 h-full w-full -rotate-90'>
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill='none'
                strokeWidth={RING_STROKE}
                className='stroke-actionSelected'
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill='none'
                strokeWidth={RING_STROKE}
                strokeLinecap='round'
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - progress)}
                className={`transition-all duration-500 ${allDone ? 'stroke-emerald-500' : 'stroke-primary'}`}
              />
            </svg>

            <span
              className={`absolute inset-[6px] flex flex-col items-center justify-center rounded-full text-white shadow-lg transition-colors duration-300 ${
                allDone ? 'bg-emerald-500' : 'bg-primary'
              }`}
            >
              {open ? (
                <CloseRoundedIcon />
              ) : (
                <>
                  <FormatListNumberedRoundedIcon sx={{ fontSize: 18 }} />
                  <span className='text-[10px] font-bold leading-none'>
                    {completedCount}/{total}
                  </span>
                </>
              )}
            </span>
          </ButtonBase>
        </Tooltip>
      </div>
    </>
  )
}
