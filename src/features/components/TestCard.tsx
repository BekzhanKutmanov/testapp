'use client'

import Link from 'next/link'

import { Card, CardContent, Typography, IconButton, Box, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useDraggable } from '@dnd-kit/core'

interface TestItem {
  id: string
  name: string
  createdAt: string
}

interface TestCardProps {
  subjectId: string
  test: TestItem
  onEditClick: (test: TestItem) => void
  onDeleteClick: (id: string) => void
}

export default function TestCard({ subjectId, test, onEditClick, onDeleteClick }: TestCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: test.id,
    data: test // важно: чтобы DragOverlay знал что рисовать
  })

  return (
    <Card
      ref={setNodeRef}
      variant='outlined'
      sx={{
        width: '100%',
        transition: '0.3s',
        borderRadius: 2,
        opacity: isDragging ? 0.4 : 1,   // оригинал "гаснет", а не дёргается transform'ом
        cursor: isDragging ? 'grabbing' : 'default',
        '&:hover': {
          boxShadow: theme => theme.shadows[4],
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent className='flex justify-between sm:items-center flex-col sm:flex-row p-3 sm:p-4 md:p-5 gap-2'>
        <Box
          className={'hidden lg:block'}
          // ref={setNodeRef}
          {...listeners}
          {...attributes}
          sx={{
            cursor: 'grab'
          }}
        >
          <DragIndicatorIcon />
        </Box>

        <Box className={'flex-1 min-w-0'}>
          <Link
            href={`/teacher/${subjectId}/createTest/${test?.id}`}
            className={'text-[var(--custom-component-color)] text-lg break-words hover:underline font-medium'}
          >
            {test.name}
          </Link>
          <Typography variant='body2' color='textSecondary' style={{ fontSize: '12px' }}>
            Дата создания: {test.createdAt}
          </Typography>
        </Box>
        <Stack direction='row' spacing={1} className={'flex justify-end'}>
          <IconButton
            color='primary'
            onClick={() => onEditClick(test)}
            size='medium'
            sx={{ backgroundColor: 'action.hover' }}
            title='Редактировать'
          >
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton
            color='error'
            onClick={() => onDeleteClick(test.id)}
            size='medium'
            sx={{ backgroundColor: 'error.lighter', '&:hover': { backgroundColor: 'error.light' } }}
            title='Удалить'
          >
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
