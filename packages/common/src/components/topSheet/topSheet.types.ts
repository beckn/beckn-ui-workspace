import { TranslationProps } from '../settings/settings.types'

export interface TopSheetComponentProps extends TranslationProps {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
  searchPlaceholder?: string
  onlineOfflineSwitch?: boolean
  onlineStatus?: boolean
  homePagePath?: string
  handleOnSwitch?: () => void
}
