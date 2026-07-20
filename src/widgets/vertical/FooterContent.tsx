'use client'

// Next Imports
import Link from 'next/link'

import { Box } from '@mui/material'

// Third-party Imports
import CopyrightIcon from '@mui/icons-material/Copyright';

import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav();

  return (
    // <div
    //   className={classnames(verticalLayoutClasses.footerContent, 'text-sm bg-backgroundPaper p-4 rounded font-bold flex items-center justify-center gap-2')}
    // >
    //   <CopyrightIcon className={'font-light text-[14px]'}/> ОшГУ 2020-г
    //
    // </div>
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.palette.mode === 'light' ? 'var(--myDarkColor)' : 'var(--myWhiteColor)',
        color:
          theme.palette.mode === 'light' ? 'var(--myWhiteColor)' : 'var(--myDarkColor)'
      })}
      className={'p-2 rounded flex justify-center p-3 items-center gap-2'}
    >
      <CopyrightIcon className={'font-light text-[14px]'}/> ОшГУ 2020-г
    </Box>
  )
}

export default FooterContent
