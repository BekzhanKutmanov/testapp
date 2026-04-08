// shared/api/QueryClientProvider.tsx
'use client'

import { useState } from 'react';

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Создаем QueryClient один раз и храним его в state
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          // Глобальный перехват ошибок из твоего apiRequest
          onError: (error: any) => {
            enqueueSnackbar(error?.responce?.data?.message || 'Ошибка', { variant: 'error' })
          }
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            enqueueSnackbar(error?.message || 'Ошибка при выполнении действия', { variant: 'error' });
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // опционально: отключаем перезапрос при смене вкладки
            retry: 1,
            throwOnError: false,
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  )

  // ручной
  // const handleClick = () => {
  //   enqueueSnackbar('Действие выполнено!', { variant: 'success' });
  // };

  // с jsx
  // enqueueSnackbar(
  //   <div style={{ display: 'flex', flexDirection: 'column' }}>
  //     <b style={{ color: '#fff' }}>Внимание!</b>
  //     <span>Вы можете <a href="/settings" style={{ color: 'yellow' }}>настроить профиль</a> прямо сейчас.</span>
  //   </div>,
  //   {
  //     variant: 'info',
  //     autoHideDuration: 5000,
  //   }
  // );

  // глобальный даже внутри функции
  // import { enqueueSnackbar } from 'notistack';
  // export const someUtilFunction = () => {
  //   // Это сработает, если SnackbarProvider уже есть в дереве компонентов
  //   enqueueSnackbar('Глобальное сообщение', { variant: 'warning' });
  // }
}
