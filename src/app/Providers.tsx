// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import ThemeProvider from '@components/theme'

// Util Imports
import QueryProvider from '@/shared/api/QueryClientProvider'
import StoreProvider from '@/features/StoreProvider'
import { ContextProvider } from '@/features/ThemeContext'
import { LangProvider } from '@/shared/i18n'
import { getLang } from '@/shared/i18n/server'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const lang = getLang()

  return (
    <StoreProvider>
      <QueryProvider>
        <VerticalNavProvider>
          <LangProvider initialLang={lang}>
            <ContextProvider>
              <ThemeProvider direction={direction}>{children}</ThemeProvider>
            </ContextProvider>
          </LangProvider>
        </VerticalNavProvider>
      </QueryProvider>
    </StoreProvider>
  )
}

export default Providers
