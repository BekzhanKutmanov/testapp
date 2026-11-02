import 'server-only'

import { cookies } from 'next/headers'

import { DEFAULT_LANG, LANG_COOKIE, dictionaries, isLang } from './lang'
import type { Lang } from './lang'

// Для серверных компонентов: язык из cookie и соответствующий словарь
export const getLang = (): Lang => {
  const value = cookies().get(LANG_COOKIE)?.value

  return isLang(value) ? value : DEFAULT_LANG
}

export const getT = () => dictionaries[getLang()]
