'use client'

import { createContext, useContext, useState } from 'react'

// 1. Initialize the context object
const ThemeContext = createContext();

// 2. Build a provider component to hold and distribute state
export function ContextProvider({ children }) {
  const [ctxDndFn, setCtxDndFn] = useState<{state: boolean, subjectId: number | null} | null>(null);

  const [ctxTheme, setCtxTheme] = useState<boolean>(false);

  // Expose both the state value and the setter function
  return <ThemeContext.Provider value={{ ctxDndFn, setCtxDndFn, ctxTheme, setCtxTheme }}>{children}</ThemeContext.Provider>
}

// 3. Build a custom hook for effortless state consumption
export function useThemeContext() {
  return useContext(ThemeContext);
}
