'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useThemeContext } from '@/features/ThemeContext'
import { useLang } from '@/shared/i18n'

const ModeDropdown = () => {
  const { t } = useLang()
  const {ctxTheme, setCtxTheme} = useThemeContext();

  // States
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings, updateSettings } = useSettings()

  const handleToggle = () => {
    if (settings.mode === 'dark') {
      updateSettings({ mode: 'light' })
    }

    if (settings.mode === 'light') {
      updateSettings({ mode: 'dark' })
    }
  }

  const getModeIcon = () => {
    if (settings.mode === 'dark') {
      return 'ri-moon-clear-line'
    } else {
      return 'ri-sun-line'
    }
  }

  return (
    <>
      <Tooltip
        title={settings.mode === 'dark' ? t.common.darkMode : t.common.lightMode}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={tooltipOpen}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          <i className={getModeIcon()} />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ModeDropdown
