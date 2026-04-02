'use client'

// Next Imports
import Link from 'next/link'

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
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'text-sm bg-backgroundPaper p-4 rounded font-bold flex items-center justify-center gap-2')}
    >
      <CopyrightIcon className={'font-light text-[14px]'}/> ОшГУ 2020-г
    </div>
  )
}

export default FooterContent
