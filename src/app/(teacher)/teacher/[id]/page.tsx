'use client';

import { useEffect } from 'react'

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query'

import { enqueueSnackbar } from 'notistack'

import BigSpinner from '@components/states/BigSpinner'
import NotFound from '@components/states/NotFound'

import { getShowSubject } from '@/features/api/api'

export default function Subject() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subject', id], // Уникальный ключ для кэширования
    queryFn: ()=> getShowSubject(Number(id)),
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Ошибка при получении предметов', { variant: 'error' })
    }
  }, [isError]);

  if(isLoading) {
    return <div className={'bg-backgroundPaper p-3 rounded flex justify-center items-center h-[100vh]'}><BigSpinner/></div>
  }

  if(isError){
    return <div className={'bg-backgroundPaper p-3 rounded flex justify-center items-center h-[100vh]'}><NotFound/></div>
  }

  return (
    <div>
      server - {data?.name}

    {/*  data?.lenght < 1 ? <EmptyState> : data?.map...*/}
    </div>
  );
}
