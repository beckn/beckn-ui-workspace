import { TranslationProps } from '../settings/settings.types'

export interface SubHeaderConstants {
  headerNames: {
    defaultNames: Record<string, string>
    frenchNames: Record<string, string>
  }
  blackList: {
    headerList: string[]
    backIconList: string[]
    orderIconList?: string[]
    cartIconList?: string[]
    invoiceDownloadIconList?: string[]
    qrCodeScanerList?: string[]
    editIconList?: string[]
  }
}

export interface ProfileSection {
  src: string
  handleClick: () => void
}

export interface SubHeaderProps extends TranslationProps {
  showCartIcon?: boolean
  headerConstants: SubHeaderConstants
  qrScanerValue?: string | any
  handleClick?: () => void
  handleClickOnEdit?: () => void
  profileSection?: ProfileSection
}
