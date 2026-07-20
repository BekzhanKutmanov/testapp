// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie } from '@core/utils/serverHelpers'
import QueryProvider from '@/shared/api/QueryClientProvider'
import StoreProvider from '@/features/StoreProvider'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()

  return (
    <QueryProvider>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
          <StoreProvider>
            <ThemeProvider direction={direction}>{children}</ThemeProvider>
          </StoreProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </QueryProvider>
  )
}

export default Providers
