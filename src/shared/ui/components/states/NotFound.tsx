'use client'

import { useLang } from '@/shared/i18n'

export default function NotFound () {
  const { t } = useLang()
  return (
    <h3 className={'text-center sm:text-lg p-4 font-bold'}>{t.common.tryLater}</h3>
  )
}
