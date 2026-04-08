'use client';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'

import MainTitle from '@/shared/ui/components/MainTitle'
import SubTitle from '@/shared/ui/components/SubTitle'
import CustomSelect from '@/shared/ui/components/CustomSelect'
import BigSpinner from '@components/states/BigSpinner'
import MiniSpinner from '@components/states/MiniSpinner'
import NotFound from '@components/states/NotFound'
import Face from '@/features/components/Face'

export default function Test() {
  return (
    <div>
      <Face/>

      <h1>Список пользователей</h1>

      <p>p element</p>
      <i>i element</i>
      <span>span element</span>

      <div className={'card bg-backgroundPaper p-3 rounded shadow-md'}>
        <p>loren</p>
      </div>

      <Box
        sx={theme => ({
          backgroundColor: theme.palette.mode === 'light' ? 'var(--myDarkColor)' : 'var(--myWhiteColor)',
          color: theme.palette.mode === 'light' ? 'var(--myWhiteColor)' : 'var(--myDarkColor)'
        })}
        className={'p-2 rounded'}
      >
        Контент
      </Box>

      <Button variant='text'>Text</Button>
      <Button variant='contained' size={'medium'} color='success'>
        Contained
      </Button>
      <Button variant='outlined'>Outlined</Button>

      <Button variant='outlined' startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button variant='contained' endIcon={<SendIcon />}>
        Send
      </Button>

      <Checkbox defaultChecked />

      <MainTitle title={'lorem'} />
      <SubTitle title={'lorem'} />

      <CustomSelect value={20}>
        <MenuItem value={10}>{10}</MenuItem>
        <MenuItem value={20}>{20}</MenuItem>
        <MenuItem value={30}>{30}</MenuItem>
      </CustomSelect>

      <BigSpinner />
      <MiniSpinner />
      <NotFound />

      <div className='bg-backgroundPaper text-textPrimary p-4 rounded-md shadow-md mt-4'>
        Тестовый блок, который автоматически меняет цвет в зависимости от темы
      </div>
    </div>
  )
}
