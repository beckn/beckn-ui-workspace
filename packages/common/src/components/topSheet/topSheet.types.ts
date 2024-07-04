import { TranslationProps } from '../settings/settings.types'

export interface TopSheetComponentProps extends TranslationProps {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
  searchPlaceholder?: string
}
