'use client';

import { test } from '../../../shared/api/test';
import {useQuery} from "@tanstack/react-query";

export default function Test (){
  const getUsers = async ()=> {
    const data = await test();
    console.log(data);
  }

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: test,
  });

  // Обработка состояний
  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {error instanceof Error ? error.message : 'Что-то пошло не так'}</div>;

  return (
    <div>
      <h1>Список пользователей</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
