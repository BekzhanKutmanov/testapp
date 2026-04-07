'use client'

import {useState} from 'react';

// MUI Imports
import {useParams, usePathname, useRouter } from 'next/navigation'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

import { addSubjects, deleteSubject, getSubjects, updateSubjects } from '@/features/api/api'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import NavigationSubjects from '@/features/components/NavigationSubjects'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const path = usePathname();

  const params = useParams();

  const router = useRouter()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const queryClient = useQueryClient()

  // State
  const [open, setOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')

  const [updateOpen, setUpdateOpen] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [updateId, setUpdateId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [currentIdForDelete, setCurrentIdForDelete] = useState<number | null>(null);

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setSubjectName('')
  }

  const handleUpdateClose = () => {
    setUpdateOpen(false)
    setUpdateId(null)
    setNewSubjectName('')
  }

  const { data } = useQuery({
    queryKey: ['subjectKey'], // Уникальный ключ для кэширования
    queryFn: getSubjects
  })

  const postMutation = useMutation({
    mutationFn: (newSubject: {name: string}) => addSubjects(newSubject), // POST

    onSuccess: async () => {
      const oldData:[{id: number, name: string}] | [] = queryClient.getQueryData(['subjectKey']) || []

      // 2. обновляем список (делает GET)
      await queryClient.invalidateQueries({
        queryKey: ['subjectKey']
      });

      // 3. берём новые данные
      const newData: [{id: number, name: string}] | [] = queryClient.getQueryData(['subjectKey']) || []

      // 4. ищем новый элемент
      const oldIds = new Set(oldData?.map(s => s?.id))
      const newItem = newData?.find(s => !oldIds.has(s.id))

      if (newItem) {
        router.push(`/teacher/${newItem.id}`)
      } else {
        console.warn('Не удалось определить новый предмет')
      }
    },

    onError: err => {
      console.error(err)
    }
  })

  const handleSave = () => {
    postMutation.mutate({ name: subjectName });
    handleClose();
  }

  const updateMutation = useMutation({
    mutationFn: (id: number | null ) => updateSubjects(newSubjectName, id),

    onSuccess: updated => {
      console.log('updated', updated)

      // 🔹 1. обновляем конкретный subject (Main)
      queryClient.setQueryData(['subject', updated.id], updated)

      // 🔹 2. обновляем список (Sidebar)
      queryClient.setQueryData(['subjectKey'], (old: any[] = []) =>
        old.map(item => (item.id === updated.id ? updated : item))
      )
    },

    onError: err => {
      console.error(err)
    }
  })

  const handleUpdate = () => {
    updateMutation.mutate(updateId)
    handleUpdateClose()
  }

  // delete
  const deleteMutation = useMutation({
    mutationFn: () => deleteSubject(currentIdForDelete),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjectKey'] });

      if(path){
        const regex = /\bteacher\b/i;

        if(regex.test(path) && params?.id === String(currentIdForDelete)){
          router.push(`/teacher/`);
        }
      }
    },

    onError: err => {
      console.error(err)
    }
  })

  const onConfirm = () => {
    deleteMutation.mutate();
  }

  const onConfirmClose = () => {
    setConfirmOpen(false);
  }

  return (
    <>
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
              className: 'bs-full overflow-y-auto overflow-x-hidden',
              onScroll: container => scrollMenu(container, false)
            }
          : {
              options: { wheelPropagation: false, suppressScrollX: true },
              onScrollY: container => scrollMenu(container, true)
            })}
      >
        {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
        {/* Vertical Menu */}

        <Menu
          menuItemStyles={menuItemStyles(theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
          menuSectionStyles={menuSectionStyles(theme)}
          className={'mt-2'}
        >
          <MenuItem href='/account-settings' icon={<i className='ri-user-settings-line' />}>
            Account Settings
          </MenuItem>
          <SubMenu label='Miscellaneous' icon={<i className='ri-question-line' />}>
            <MenuItem href='/error' target='_blank'>
              Error
            </MenuItem>
            <MenuItem href='/under-maintenance' target='_blank'>
              Under Maintenance
            </MenuItem>
          </SubMenu>
          <MenuItem href='/card-basic' icon={<i className='ri-bar-chart-box-line' />}>
            Cards
          </MenuItem>
          {/*</MenuSection>*/}

          <SubMenu
            label='Предметы'
            icon={<i className='ri-home-smile-line' />}
            suffix={<Chip label='5' size='small' color='error' />}
          >
            {/* Скрытый MenuItem для того чтобы SubMenu оставалось открытым при нахождении на страницах /teacher/* */}
            <MenuItem href='/teacher' exactMatch={false} activeUrl='/teacher' className='hidden' />

            {data && data?.length ? (
              <NavigationSubjects
                data={data || []}
                onUpdate={id => {
                  setUpdateId(id)
                  setUpdateOpen(true)
                }}
                onDelete={(id: number) => {
                  setCurrentIdForDelete(id);
                  setConfirmOpen(true);
                }}
              />
            ) : (
              <div className={'text-red-500 px-3 my-4 w-full flex justify-center'}>Повторите позже</div>
            )}

            <div className={'flex items-center justify-center my-2'}>
              <Button variant='contained' size={'small'} startIcon={<AddIcon />} onClick={handleOpen}>
                Новый предмет
              </Button>
            </div>

          </SubMenu>
            {/*<MenuItem*/}
            {/*  href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/ecommerce`}*/}
            {/*  suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}*/}
            {/*  target='_blank'*/}
            {/*>*/}
            {/*  eCommerce*/}
            {/*</MenuItem>*/}
            {/*<MenuItem*/}
            {/*  href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/logistics`}*/}
            {/*  suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}*/}
            {/*  target='_blank'*/}
            {/*>*/}
            {/*  Logistics*/}
            {/*</MenuItem>*/}
        </Menu>
      </ScrollWrapper>

      {/*// new subject*/}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>Новый предмет</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Название'
            type='text'
            fullWidth
            variant='outlined'
            value={subjectName}
            onChange={e => setSubjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Назад</Button>
          <Button onClick={handleSave} variant='contained' color='primary'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/*// update subject*/}
      <Dialog open={updateOpen} onClose={handleUpdateClose} fullWidth maxWidth='xs'>
        <DialogTitle>Обновить предмет</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Название'
            type='text'
            fullWidth
            variant='outlined'
            value={newSubjectName}
            onChange={e => setNewSubjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Назад</Button>
          <Button onClick={handleUpdate} variant='contained' color='primary'>
            Обновить
          </Button>
        </DialogActions>
      </Dialog>

    <Dialog open={confirmOpen} onClose={onConfirmClose}>
      <DialogTitle>Вы точно хотите удалить?</DialogTitle>

      <DialogActions>
        <Button onClick={onConfirmClose}>
          Отмена
        </Button>

        <Button
          color="error"
          onClick={() => {
            onConfirmClose();
            onConfirm();
          }}
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default VerticalMenu
