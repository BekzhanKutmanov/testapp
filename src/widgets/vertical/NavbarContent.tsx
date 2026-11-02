'use client'

// React Imports
import { useContext, useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import LangSwitcher from '@/shared/ui/components/LangSwitcher'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import UserDropdown from '@/shared/ui/components/UserDropdown'
import MainTitle from '@/shared/ui/components/MainTitle'
import { useLang } from '@/shared/i18n'

const NavbarContent = () => {
  const { t } = useLang()
  // States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Hooks
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const router = useRouter()

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleCloseMenu()
    router.push('/login')
  }

  return (
    <div
      className={classnames(
        verticalLayoutClasses.navbarContent,
        'bg-backgroundPaper p-2 px-4 rounded-ee-xl rounded-es-xl border-b-2 border-primary/20 flex items-center justify-between gap-4 is-full'
      )}
    >
      <div className='flex items-center gap-2 sm:gap-4'>
        <NavToggle />
        <div className={'hidden sm:flex items-center gap-1'}>
          <div className={' flex justify-center items-start'}>
            <img src={'/images/logo-remove.png'} className={'w-[50px] '}/>
          </div>
          <h2 className={'sm:text-3xl'}>{t.app.name}</h2>
        </div>
      </div>

      <div className='flex items-center'>
        {/*{isMobile ? (*/}
        {/*  <>*/}
        {/*    <b className={'p-2 text-[1rem]'}>{getShortName('Кутманов Бекжан Райымкулови')}</b>*/}
        {/*    <IconButton onClick={handleOpenMenu} className='text-textPrimary'>*/}
        {/*      <i className='ri-more-2-fill' />*/}
        {/*    </IconButton>*/}
        {/*    <Menu*/}
        {/*      anchorEl={anchorEl}*/}
        {/*      open={open}*/}
        {/*      onClose={handleCloseMenu}*/}
        {/*      transformOrigin={{ horizontal: 'right', vertical: 'top' }}*/}
        {/*      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}*/}
        {/*      sx={{ '& .MuiMenu-paper': { minWidth: '150px' } }}*/}
        {/*    >*/}
        {/*      <div className='flex items-center justify-around p-2'>*/}
        {/*        <IconButton className='text-textPrimary'>*/}
        {/*          <i className='ri-notification-2-line' />*/}
        {/*        </IconButton>*/}
        {/*      </div>*/}
        {/*      <Divider />*/}
        {/*      <MenuItem onClick={handleLogout} className={'flex items-center gap-2 justify-center'}>*/}
        {/*        <ListItemIcon>*/}
        {/*          <i className='ri-logout-box-r-line' />*/}
        {/*        </ListItemIcon>*/}
        {/*        <ListItemText primary='Выйти' className={'text-center inline-block'}/>*/}
        {/*      </MenuItem>*/}
        {/*    </Menu>*/}
        {/*  </>*/}
        {/*) : (*/}
        <>
          <LangSwitcher />
          <IconButton className='text-textPrimary'>
            <i className='ri-notification-2-line' />
          </IconButton>
          {true ? (
            <UserDropdown />
          ) : (
            <Button variant='contained' size={'medium'} color='error'>
              {t.common.login}
            </Button>
          )}
          {/*<b className={'p-2 text-[1.1rem]'}>{getShortName('Кутманов Бекжан Райымкулови')}</b>*/}
          {/*<i className='ri-logout-box-r-line cursor-pointer hover:bg-[gray]' onClick={()=> router.push('/login')} />*/}
        </>
        {/*)}*/}
      </div>
    </div>
  )
}

export default NavbarContent
