'use client';

import {useQuery} from "@tanstack/react-query";
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox'

import { test } from '@/shared/api/test';

export default function Test (){

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: test,
    enabled: false,
  });

  // Обработка состояний
  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {error instanceof Error ? error.message : 'Что-то пошло не так'}</div>;

  return (
    <div>
      <h1>Список пользователей</h1>
      <Button onClick={()=> refetch()}>Показать успех</Button>

      <Button variant="text">Text</Button>
      <Button variant="contained" size={'medium'} color="success">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <Button variant="outlined" startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>

      <Checkbox defaultChecked />

    </div>
  );
}
