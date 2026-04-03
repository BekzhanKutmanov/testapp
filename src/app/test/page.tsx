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

export default function Test() {
  return (
    <div>
      <h1>Список пользователей</h1>

      <p>p element</p>
      <i>i element</i>
      <span>span element</span>

      <div className={'card bg-backgroundPaper p-3 rounded shadow-md'}>
        <p>loren</p>
      </div>

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
    </div>
  )
}
