'use client'

import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { createContext, useContext, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useThemeContext } from '@/features/ThemeContext'

interface DndUiContextType {
  isDragging: boolean
  activeId: string | null
}

const DndUiContext = createContext<DndUiContextType>({ isDragging: false, activeId: null })

export const useDndUi = () => useContext(DndUiContext)

// TestCardPreview.tsx — чисто визуал, без useDraggable
export function TestCardPreview({ test }: { test: { id: string; name: string; createdAt: string } }) {

  return (
    <Card
      variant='outlined'
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: theme => theme.shadows[6],
        cursor: 'grabbing'
      }}
    >
      <CardContent className='flex items-center gap-2 p-3'>
        <DragIndicatorIcon />
        <Box className='flex-1 min-w-0'>
          <Typography className='text-lg font-medium truncate'>
            {test.name}
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ fontSize: '12px' }}>
            Дата создания: {test.createdAt}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function TeacherDndProvider({ children }: { children: React.ReactNode }) {
  const { ctxDndFn, setCtxDndFn } = useThemeContext();

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTest, setActiveTest] = useState<{ id: string; name: string } | null>(null)

  // без этого клик по кнопкам "Редактировать/Удалить" может случайно триггерить drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log('drag start data:', event.active.data.current)
    setActiveId(String(event.active.id))
    // достаём данные о карточке, чтобы отрисовать её в оверлее
    setActiveTest(event.active.data.current as any)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const testId = event.active.id
    const subjectId = event.over?.id

    setActiveId(null)
    setActiveTest(null)

    if (!subjectId) return;
    setCtxDndFn({state: true, subjectId: subjectId});
    console.log(testId, subjectId);
  }

  return (
    <DndUiContext.Provider value={{ isDragging: !!activeId, activeId }}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveId(null)
          setActiveTest(null)
        }}
      >
        {isDragging => null}
        {children}

        {/* Плавающая подсказка */}
        {activeId && (
          <div className="fixed top-5 right-5 z-50 rounded-lg bg-blue-600 text-white px-4 py-3 shadow-lg pointer-events-none">
            Перетащите тест на нужный предмет
          </div>
        )}

        {/* Летающий клон карточки — вот это и даёт "красивый" drag */}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeTest ? <TestCardPreview test={activeTest} /> : null}
        </DragOverlay>
      </DndContext>
    </DndUiContext.Provider>
  )
}
