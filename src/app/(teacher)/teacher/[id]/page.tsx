'use client';

import { notFound, redirect, useParams } from 'next/navigation';

import { getShowSubject, getSubjects } from '@/features/api/api'
import NotFound from '@components/states/NotFound'
import { useQuery } from '@tanstack/react-query'

interface PageProps {
  params: { id: string };
}

export default function Subject() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subject', id], // Уникальный ключ для кэширования
    queryFn: ()=> getShowSubject(Number(id)),
  });

  return (
    <div>
      server - {data?.name}
    </div>
  );
}
