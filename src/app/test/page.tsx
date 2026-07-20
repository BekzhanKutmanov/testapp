'use client';

import { useState, useEffect } from 'react'

import * as faceapi from 'face-api.js'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'

import MainTitle from '@/shared/ui/components/MainTitle'
import SubTitle from '@/shared/ui/components/SubTitle'
import CustomSelect from '@/shared/ui/components/CustomSelect'
import BigSpinner from '@/shared/ui/components/states/BigSpinner'
import MiniSpinner from '@/shared/ui/components/states/MiniSpinner'
import NotFound from '@/shared/ui/components/states/NotFound'

import { ProctorCamera } from '@/features/components/Face'

export default function Test() {
  const [mounted, setMounted] = useState(false)

  const [descriptor, setDescriptor] = useState<number[] | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)

  const [facesDetected, setFacesDetected] = useState(0)
  const [matchResult, setMatchResult] = useState('')
  const [isLookingAway, setIsLookingAway] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setImageURL(url)

    const img = new Image()
    img.src = url
    await new Promise(resolve => { img.onload = resolve })

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) { alert('Лицо не найдено на фото!'); return }
    setDescriptor(Array.from(detection.descriptor))
  }

  const [screenshots, setScreenshots] = useState<{ blob: Blob; timestamp: number; type: string; url: string }[]>([])

  const handleNewScreenshot = (item: { blob: Blob; timestamp: number; type: string }) => {
    const url = URL.createObjectURL(item.blob)   // Blob сам по себе не рендерится в <img>, нужен object URL
    setScreenshots(prev => [...prev, { ...item, url }])
  }

  if (!mounted) return null  // ← сервер рендерит null, клиент рендерит компонент

  return (
    <div>

      {/*<input type="file" accept="image/*" onChange={handleFileChange} />*/}
      {/*{imageURL && <img src={imageURL} width={200} />}*/}

      <ProctorCamera
        onFacesDetected={setFacesDetected}
        onMatchResult={setMatchResult}
        onLookingAway={setIsLookingAway}
        facesDetected={facesDetected}
        matchResult={matchResult}
        isLookingAway={isLookingAway}
      />

      <div>
        {screenshots.map((s, i) => (
          <div key={i}>
            <img src={s.url} width={160} />
            <div>{s.type} — {new Date(s.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      {/*<h1>Список пользователей</h1>*/}

      {/*<p>p element</p>*/}
      {/*<i>i element</i>*/}
      {/*<span>span element</span>*/}

      {/*<div className={'card bg-backgroundPaper p-3 rounded shadow-md'}>*/}
      {/*  <p>loren</p>*/}
      {/*</div>*/}

      {/*<Box*/}
      {/*  sx={theme => ({*/}
      {/*    backgroundColor: theme.palette.mode === 'light' ? 'var(--myDarkColor)' : 'var(--myWhiteColor)',*/}
      {/*    color: theme.palette.mode === 'light' ? 'var(--myWhiteColor)' : 'var(--myDarkColor)'*/}
      {/*  })}*/}
      {/*  className={'p-2 rounded'}*/}
      {/*>*/}
      {/*  Контент*/}
      {/*</Box>*/}

      {/*<Button variant='text'>Text</Button>*/}
      {/*<Button variant='contained' size={'medium'} color='success'>*/}
      {/*  Contained*/}
      {/*</Button>*/}
      {/*<Button variant='outlined'>Outlined</Button>*/}

      {/*<Button variant='outlined' startIcon={<DeleteIcon />}>*/}
      {/*  Delete*/}
      {/*</Button>*/}
      {/*<Button variant='contained' endIcon={<SendIcon />}>*/}
      {/*  Send*/}
      {/*</Button>*/}

      {/*<Checkbox defaultChecked />*/}

      {/*<MainTitle title={'lorem'} />*/}
      {/*<SubTitle title={'lorem'} />*/}

      {/*<CustomSelect value={20}>*/}
      {/*  <MenuItem value={10}>{10}</MenuItem>*/}
      {/*  <MenuItem value={20}>{20}</MenuItem>*/}
      {/*  <MenuItem value={30}>{30}</MenuItem>*/}
      {/*</CustomSelect>*/}

      {/*<BigSpinner />*/}
      {/*<MiniSpinner />*/}
      {/*<NotFound />*/}

      {/*<div className='bg-backgroundPaper text-textPrimary p-4 rounded-md shadow-md mt-4'>*/}
      {/*  Тестовый блок, который автоматически меняет цвет в зависимости от темы*/}
      {/*</div>*/}
    </div>
  )
}
