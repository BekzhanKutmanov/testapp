'use client'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import classnames from 'classnames'

import { useLang } from '@/shared/i18n'
import { LANGS, dictionaries } from '@/shared/i18n/lang'

const LangSwitcher = () => {
  const { lang, setLang, t } = useLang()
  const activeIndex = LANGS.indexOf(lang)

  return (
    <Tooltip title={t.common.language}>
      <div
        role='radiogroup'
        aria-label={t.common.language}
        className='relative mx-1 flex items-center rounded-full border border-solid border-primaryLight bg-primaryLighter p-0.5'
      >
        {/* Скользящая подложка под активным языком */}
        <span
          aria-hidden
          className='absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out'
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {LANGS.map(code => {
          const active = code === lang

          return (
            <button
              key={code}
              type='button'
              role='radio'
              aria-checked={active}
              title={dictionaries[code].langName}
              onClick={() => setLang(code)}
              className={classnames(
                'relative z-[1] min-w-[34px] cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-xs font-semibold tracking-wide transition-colors duration-300',
                active ? 'text-white' : 'text-textSecondary hover:text-primary'
              )}
            >
              {dictionaries[code].langShort}
            </button>
          )
        })}
      </div>
    </Tooltip>
  )
}

export default LangSwitcher
