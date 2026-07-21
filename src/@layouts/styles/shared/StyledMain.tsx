// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

type StyledMainProps = {
  isContentCompact: boolean
}

const StyledMain = styled.main<StyledMainProps>(({ isContentCompact }) => ({
  padding: themeConfig.layoutPadding,

  ...(isContentCompact && {
    marginInline: 'auto',
    maxInlineSize: themeConfig.compactContentWidth
  }),

  '@media (max-width: 768px)': {
    padding: 14
  },

  '@media (max-width: 480px)': {
    padding: 10
  }
}))

export default StyledMain
