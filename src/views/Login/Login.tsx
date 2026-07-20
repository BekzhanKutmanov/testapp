'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'

// React Hook Form Imports
import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { enqueueSnackbar } from 'notistack'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@views/Login/ui/Illustrations'

// Hook Import
import { useImageVariant } from '@core/hooks/useImageVariant'

import { adToken, getLogin } from '@/shared/api/auth/auth'
import { toastMessages } from '@/shared/constants/toastMessages'

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const postMutation = useMutation({
    mutationFn: (data: any) => adToken(data.email, data.password), // POST

    onSuccess: async () => {
      try {
        const getData = await getLogin() // GET
        console.log(getData)
        if (getData) {
          enqueueSnackbar(toastMessages.auth.loginSuccess, { variant: 'success' })
        }
      } catch (err) {
        enqueueSnackbar(toastMessages.auth.loginError, { variant: 'error' })
      }
    },

    onError: err => {
      console.error(err)
    }
  })

  const onSubmit = (data: any) => {
    postMutation.mutate(data)
  }

  // Регулярное выражение для опасных символов
  const unsafeCharsRegex = /[<>{}[\]"']/

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!px-12 sm:!py-9'>
          <Link href='/public' className='flex justify-center items-center mbe-4'>
            Система тестирование ОшГУ
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography className={'test-sm'} variant='h4'>{`Добро пожаловать в Test App!👋🏻`}</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Логин обязателен',
                  validate: value => !unsafeCharsRegex.test(value) || 'Используются недопустимые символы'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='AVN логин'
                    error={!!errors.email}
                    helperText={errors.email ? (errors.email.message as string) : ''}
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                rules={{
                  required: 'Пароль обязателен',
                  validate: value => !unsafeCharsRegex.test(value) || 'Используются недопустимые символы'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Пароль'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password ? (errors.password.message as string) : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />

              <Button fullWidth variant='contained' type='submit' disabled={!isValid || postMutation.isPending}>
                Войти
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
