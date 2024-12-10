import { TranslationProps } from '../settings/settings.types'

interface HeaderConstants {
  blackList: {
    appLogoBlackList: string[]
    homeIconBlackList: string[]
    languageIconWhiteList: string[]
    menuIconWhiteList: string[]
  }
}

interface MenuItems {
  id: string
  label: string
  icon: string
  href: string
  color?: string
  dataTest?: string
  handleOnClick?: () => void
}

export interface HeaderProps extends TranslationProps {
  handleMenuClick?: () => void
  headerConstants: HeaderConstants
  appLogo?: string
  menuItems?: MenuItems[]
  settingsMenu?: boolean
  homePagePath?: string
  clearLocalStorageOnHomeIcon?: boolean
}
