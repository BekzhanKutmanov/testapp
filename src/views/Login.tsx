'use client'

// React Imports

import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useQuery, useMutation } from '@tanstack/react-query'

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
import Illustrations from '@components/Illustrations'

// Hook Import

import { useImageVariant } from '@core/hooks/useImageVariant'

import { adToken, getLogin } from '@/shared/api/auth/auth'
import { toastMessages } from '@/shared/constants/toastMessages'


const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postMutation.mutate();
  }

  const postMutation = useMutation({
    mutationFn: ()=> adToken(email, password), // POST

    onSuccess: async () => {
      try {
        const getData = await getLogin(); // GET
        console.log(getData);
        if(getData){
          enqueueSnackbar(toastMessages.auth.loginSuccess, { variant: 'success' });
        }
        // обработка данных

        // например сохранить
        // setState(processed)

        // редирект
        // router.push("/");
      } catch (err) {
        enqueueSnackbar(toastMessages.auth.loginError, { variant: 'error' });
      }
    },

    onError: (err) => {
      // ошибка POST
      console.error(err);
    },
  });

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!px-12 sm:!py-9'>
          <Link href='/' className='flex justify-center items-center mbe-4'>
            {/*<Logo />*/}
            Система тестирование ОшГУ
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Добро пожаловать Test App!👋🏻`}</Typography>
              {/*<Typography className='mbs-1'>Please sign-in to your account and start the adventure</Typography>*/}
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField autoFocus fullWidth label='AVN логин' value={email} onChange={(e)=> setEmail(e.target.value)} />
              <TextField
                fullWidth
                label='Пароль'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
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
              <Button fullWidth variant='contained' type='submit'>
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
