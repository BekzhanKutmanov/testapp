'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { DEFAULT_LANG, LANG_COOKIE, dictionaries } from './lang'
import type { Dict, Lang } from './lang'

export type { Dict, Lang } from './lang'

type LangContextValue = {
  lang: Lang
  t: Dict
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ initialLang = DEFAULT_LANG, children }: { initialLang?: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    // Cookie читается на сервере, чтобы первая отрисовка сразу была на нужном языке
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
  }, [])

  const toggleLang = useCallback(() => setLang(lang === 'ru' ? 'ky' : 'ru'), [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang, toggleLang }), [lang, setLang, toggleLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)

  if (!ctx) throw new Error('useLang must be used within LangProvider')

  return ctx
}
