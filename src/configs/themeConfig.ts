export type Config = {
  layoutPadding: number
  compactContentWidth: number
  disableRipple: boolean
}

const themeConfig: Config = {
  layoutPadding: 20, // Common padding for header, content, footer layout components (in px)
  compactContentWidth: 1440, // in px
  disableRipple: false // true, false
}

export default themeConfig
