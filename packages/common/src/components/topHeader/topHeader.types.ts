import { TranslationProps } from '../settings/settings.types'

interface HeaderConstants {
  blackList: {
    appLogoBlackList: string[]
    homeIconBlackList: string[]
    languageIconWhiteList: string[]
    menuIconWhiteList: string[]
  }
}

export interface HeaderProps extends TranslationProps {
  handleMenuClick?: () => void
  headerConstants: HeaderConstants
  appLogo?: string
}
