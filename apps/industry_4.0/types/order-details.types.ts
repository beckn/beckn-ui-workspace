import { ConfirmResponseModel } from './confirm.types'
import { StatusResponseModel, SupportModel } from './status.types'

export interface UIState {
  isProceedDisabled: boolean
  isLoading: boolean
  isLoadingForTrackAndSupport: boolean
  isMenuModalOpen: boolean
  isCancelMenuModalOpen: boolean
  isLoadingForCancel: boolean
}

export interface DataState {
  confirmData: ConfirmResponseModel[] | null
  statusData: StatusResponseModel[]
  trackUrl: string | null
  supportData: SupportModel | null
}

export interface ProcessState {
  apiCalled: boolean
  allOrderDelivered: boolean
  radioValue: string
}
