'use client';

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

import BigSpinner from '@components/states/BigSpinner'
import NotFound from '@components/states/NotFound'

import { getShowSubject } from '@/features/api/api'
import TestCard from '@/features/components/TestCard'

interface TestItem {
  id: string;
  name: string;
  createdAt: string;
}

export default function TestListClient({id}: {id: string}) {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [editName, setEditName] = useState('');

  // Состояние для подтверждения удаления
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [testToDeleteId, setTestToDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subject', id], // Уникальный ключ для кэширования
    queryFn: ()=> getShowSubject(Number(id)),
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Ошибка при получении предметов', { variant: 'error' })
    }
  }, [isError]);

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
    };

    setTests([...tests, newTest]);
    enqueueSnackbar('Тест успешно создан', { variant: 'success' });
  };

  const handleEditClick = (test: TestItem) => {
    setEditingTest(test);
    setEditName(test.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTestToDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (testToDeleteId) {
      setTests(tests.filter(test => test.id !== testToDeleteId));
      enqueueSnackbar('Тест удален', { variant: 'info' });
      setIsDeleteConfirmOpen(false);
      setTestToDeleteId(null);
    }
  };

  const handleSaveEdit = () => {
    if (editingTest) {
      setTests(tests.map(t => t.id === editingTest.id ? { ...t, name: editName } : t));
      setIsEditModalOpen(false);
      setEditingTest(null);
      enqueueSnackbar('Название теста изменено', { variant: 'success' });
    }
  };

  // Рендер блока списка тестов
  const renderTestList = () => (
    <Stack spacing={4}>
      {tests.length > 0 ? (
        tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))
      ) : (
        <Typography variant='body1' color='textSecondary' align='center' className='mt-10'>
          Тестов пока нет. Нажмите кнопку выше, чтобы создать первый тест.
        </Typography>
      )}
    </Stack>
  );

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
          onChange={(e) => setEditName(e.target.value)}
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
  );

  // Рендер модального окна подтверждения удаления
  const renderDeleteConfirmModal = () => (
    <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы уверены, что хотите удалить этот тест? Это действие нельзя будет отменить.
        </DialogContentText>
      </DialogContent>
      <DialogActions className='pb-4 px-6'>
        <Button onClick={() => setIsDeleteConfirmOpen(false)} color='inherit'>
          Отмена
        </Button>
        <Button onClick={handleConfirmDelete} variant='contained' color='error'>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );

  if(isLoading) {
    return <div className={'bg-backgroundPaper p-3 rounded flex justify-center items-center h-[100vh]'}><BigSpinner/></div>
  }

  if(isError){
    return <div className={'bg-backgroundPaper p-3 rounded flex justify-center items-center h-[100vh]'}><NotFound/></div>
  }

  return (
    <Box className='p-4 md:p-6 w-full max-w-screen-xl mx-auto'>
      <Stack direction='row' justifyContent='space-between' alignItems='center' className='mb-6 flex-wrap gap-4'>
        {/*<Typography variant='h5' className='font-bold'>*/}
        {/*  {data?.name}*/}
        {/*</Typography>*/}
        <span className={'text-xl sm:text-2xl font-bold'}>{data?.name}</span>
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddTest}
          className='whitespace-nowrap w-full sm:w-auto'
        >
          Создать новый тест
        </Button>
      </Stack>

      {renderTestList()}
      {renderEditModal()}
      {renderDeleteConfirmModal()}
    </Box>
  );
}
