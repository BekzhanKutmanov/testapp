'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { enqueueSnackbar } from 'notistack'

import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Stack,
  DialogContentText
} from '@mui/material'

import { useSelector } from 'react-redux'

import BigSpinner from '@/shared/ui/components/states/BigSpinner'
import NotFound from '@/shared/ui/components/states/NotFound'

import { getShowSubject } from '@/features/api/api'
import TestCard from '@/features/components/TestCard'

import type { TestItem } from '@/types/subjects/TestItem'

import MobileNavigationSubjects from '@/shared/ui/components/MobileNavigationSubjects'
import useMediaQuery from '@menu/hooks/useMediaQuery'
import Image from 'next/image'
import EmptyState from '@/shared/ui/components/states/EmptyState'
import InfoBlock from '@/shared/ui/components/InfoBlock'

export default function TestListClient({ id }: { id: string }) {
  const [tests, setTests] = useState<TestItem[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<TestItem | null>(null)
  const [editName, setEditName] = useState('')

  // Состояние для подтверждения удаления
  const [isDeleteConfirmOpen, setIsDeleteConfirm] = useState(false)
  const [testToDeleteId, setTestToDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => getShowSubject(Number(id))
  })

  const isMedia = useMediaQuery('640px')

  const subjects = useSelector(state => state.subjects.value)

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Ошибка при получении предметов', { variant: 'error' })
    }
  }, [isError])

  useEffect(() => {
    console.log(subjects)
  }, [subjects])

  const handleAddTest = () => {
    const newTest: TestItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: `тест ${tests.length}`,
      createdAt: new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setTests([...tests, newTest])
    enqueueSnackbar('Тест успешно создан', { variant: 'success' })
  }

  const handleEditClick = (test: TestItem) => {
    setEditingTest(test)
    setEditName(test.name)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setTestToDeleteId(id)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (testToDeleteId) {
      setTests(tests.filter(test => test.id !== testToDeleteId))
      enqueueSnackbar('Тест удален', { variant: 'info' })
      setIsDeleteConfirm(false)
      setTestToDeleteId(null)
    }
  }

  const handleSaveEdit = () => {
    if (editingTest) {
      setTests(tests.map(t => (t.id === editingTest.id ? { ...t, name: editName } : t)))
      setIsEditModalOpen(false)
      setEditingTest(null)
      enqueueSnackbar('Название теста изменено', { variant: 'success' })
    }
  }

  // Рендер блока списка тестов
  const renderTestList = () => (
    <Stack spacing={4}>
      {tests.length > 0 ? (
        tests.map(test => (
          <TestCard key={test.id} test={test} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
        ))
      ) : (
        <InfoBlock>
            <>
              <Box
                sx={{
                  backgroundColor: 'primary.lighter',
                  color: 'primary.main',
                  borderRadius: '50%',
                  p: 2,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image alt={'Нет данных'} src={'/images/empty-box.png'} width={140} height={140} />
              </Box>
              <Typography variant='body1' color='' sx={{ mb: 4, maxWidth: 300 }}>
                Тестов пока нет. Нажмите кнопку выше, чтобы создать первый тест.
              </Typography>
            </>
        </InfoBlock>
      )}
    </Stack>
  )

  // Рендер модального окна редактирования
  const renderEditModal = () => (
    <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} fullWidth maxWidth='xs'>
      <DialogTitle>Редактировать название теста</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Название теста'
          type='text'
          fullWidth
          variant='outlined'
          value={editName}
          onChange={e => setEditName(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions className='pb-4 px-6'>
        <Button onClick={() => setIsEditModalOpen(false)} color='inherit'>
          Отмена
        </Button>
        <Button onClick={handleSaveEdit} variant='contained' color='primary'>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )

  // Рендер модального окна подтверждения удаления
  const renderDeleteConfirmModal = () => (
    <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirm(false)}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы уверены, что хотите удалить этот тест? Это действие нельзя будет отменить.
        </DialogContentText>
      </DialogContent>
      <DialogActions className='pb-4 px-6'>
        <Button onClick={() => setIsDeleteConfirm(false)} color='inherit'>
          Отмена
        </Button>
        <Button onClick={handleConfirmDelete} variant='contained' color='error'>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  )

  if (isLoading) {
    return (
      <div className={'p-3 rounded flex justify-center items-center h-[100vh]'}>
        <BigSpinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={'p-3 rounded flex justify-center items-center h-[100vh]'}>
        <NotFound />
      </div>
    )
  }

  return (
    <Box className='p-2 md:p-4 w-full max-w-screen-xl mx-auto'>
      <Stack direction='row' justifyContent='space-between' alignItems='center' className='mb-6 flex-wrap gap-3'>
        <span className={'text-xl sm:text-2xl font-bold sm:max-w-3xl sm:text-nowrap sm:overflow-hidden sm:text-ellipsis block'}>{data?.name}</span>
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddTest}
          className='whitespace-nowrap w-full sm:w-auto'
        >
          Создать новый тест
        </Button>
      </Stack>

      <Box className={'max-w-5xl m-auto'}>{renderTestList()}</Box>
      {renderEditModal()}
      {renderDeleteConfirmModal()}

      {isMedia && subjects && subjects.length > 0 && <MobileNavigationSubjects data={subjects} onClose={() => {}} />}
    </Box>
  )
}
