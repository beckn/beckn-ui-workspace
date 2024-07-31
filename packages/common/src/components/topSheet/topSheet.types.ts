import { TranslationProps } from '../settings/settings.types'

export interface TopSheetComponentProps extends TranslationProps {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
  searchPlaceholder?: string
  enableLocation?: boolean
  handleOnEnableLocation?: () => void
  onlineOfflineSwitch?: boolean
  onlineStatus?: boolean
  handleOnSwitch?: () => void
}
