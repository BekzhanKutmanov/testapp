'use client'

import React, { useEffect, useState } from 'react'

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
  DialogContentText,
  Alert
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
import InfoBlock from '@/shared/ui/components/InfoBlock'
import BreadCrumb from '@/shared/ui/BreadCrumb'
import CustomSelect from '@/shared/ui/components/CustomSelect'
import MenuItem from '@mui/material/MenuItem'
import CopyExternalTest from '@/shared/ui/CopyExternalTest'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import SubjectSelect from '@/shared/ui/SubjectSelect'
import ExportCurrentTest from '@/shared/ui/ExportCurrentTest'

export default function TestListClient({ id }: { id: string }) {
  const [tests, setTests] = useState<TestItem[]>([])
  const [nameTest, setNameTest] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<TestItem | null>(null)
  const [editName, setEditName] = useState('')

  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false)

  // Состояние для подтверждения удаления
  const [isDeleteConfirmOpen, setIsDeleteConfirm] = useState(false)
  const [testToDeleteId, setTestToDeleteId] = useState<string | null>(null)

  const [testImportFn, setTestImportFn] = useState(false)
  const [exportTestFn, setExportTestFn] = useState(false)

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
    console.log(data)
  }, [data])

  const handleAddTest = () => {
    const newTest: TestItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: nameTest,
      createdAt: new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setTests([...tests, newTest])
    setIsCreateTestModalOpen(false)
    setNameTest('')
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

  // рендер модального окна создания тестов
  const renderCreateTestModal = () => (
    <Dialog open={isCreateTestModalOpen} onClose={() => setIsCreateTestModalOpen(false)} fullWidth maxWidth='xs'>
      <DialogTitle>Создание теста</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            autoFocus
            margin='dense'
            label='Название теста'
            type='text'
            fullWidth
            variant='outlined'
            value={nameTest}
            onChange={e => setNameTest(e.target.value)}
            sx={{ mt: 2 }}
            size={'small'}
          />
          <div className={`text-end text-[12px] mr-1 ${nameTest?.length > 100 ? 'text-red-500 font-bold' : ''}`}>
            {nameTest?.length}/100
          </div>
        </Box>

        <div className={'flex items-center gap-1 pl-2'}>
          <span
            onClick={() => setTestImportFn(!testImportFn)}
            className={'cursor-pointer text-[13px] text-blue-500 hover:text-blue-600'}
          >
            [{testImportFn ? '-' : '+'}] Импортировать готовый тест
          </span>
        </div>

        {testImportFn && (
          <CopyExternalTest
            subjectId={1}
            externalTestId={paramId => console.log(paramId)}
            externalSubjectId={paramId => console.log(paramId)}
          />
        )}
      </DialogContent>
      <DialogActions className='pb-4 px-6'>
        <Button size={'small'} onClick={() => setIsCreateTestModalOpen(false)} color='inherit'>
          Отмена
        </Button>
        <Button size={'small'} onClick={handleAddTest} variant='contained' color='primary'>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )

  // Рендер блока списка тестов
  const renderTestList = () => (
    <Stack spacing={4}>
      {tests.length > 0 ? (
        tests.map(test => (
          <TestCard
            key={test.id}
            subjectId={id}
            test={test}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
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
      <DialogTitle>Редактирование теста</DialogTitle>
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
        <div className={`text-end text-[12px] mr-1 ${editName?.length > 100 ? 'text-red-500 font-bold' : ''}`}>
          {editName?.length}/100
        </div>
        <Box>
          <div className={'flex items-center gap-1 pl-2'}>
            <span
              onClick={() => setExportTestFn(!exportTestFn)}
              className={'cursor-pointer text-[13px] text-blue-500 hover:text-blue-600'}
            >
              [{exportTestFn ? '-' : '+'}] Переместить или копировать в другой предмет
            </span>
          </div>

          <div className={'bottom-shadow'}></div>

          {exportTestFn && <ExportCurrentTest currentSubjectName={data?.name} selectedSubject={(id: number | null) => console.log('test list ', id)} />}
        </Box>
      </DialogContent>
      <DialogActions className='pb-4 px-6'>
        <Button onClick={() => {
          setIsEditModalOpen(false);
          setExportTestFn(false);
        }} color='inherit'>
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
      <BreadCrumb />

      <Stack direction='row' justifyContent='space-between' alignItems='center' className='mb-6 flex-wrap gap-3'>
        <span
          className={
            'text-xl sm:text-2xl font-bold sm:max-w-3xl sm:text-nowrap sm:overflow-hidden sm:text-ellipsis block'
          }
        >
          {data?.name}
        </span>
        <Button
          variant='contained'
          color='primary'
          // onClick={handleAddTest}
          onClick={() => setIsCreateTestModalOpen(true)}
          className='whitespace-nowrap w-full sm:w-auto'
        >
          Создать тест
        </Button>
      </Stack>

      {renderCreateTestModal()}
      <Box className={'max-w-5xl m-auto'}>{renderTestList()}</Box>
      {renderEditModal()}
      {renderDeleteConfirmModal()}

      {isMedia && subjects && subjects.length > 0 && <MobileNavigationSubjects data={subjects} onClose={() => {}} />}
    </Box>
  )
}
