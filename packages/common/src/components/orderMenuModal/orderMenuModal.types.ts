export enum OrderMenuType {
  TRACK_ORDER = 'trackOrder',
  UPDATE_ORDER = 'updateOrder',
  CANCEL_ORDER = 'cancelOrder'
}

export enum customerServiceMenuType {
  CALL_SERVICE = 'callService',
  EMAIL_SERVICE = 'emailService'
}

export interface OrderMenuModalProps {
  isOpen: boolean
  onClose: () => void
  isLoadingForTrackAndSupport: boolean
  onMenuItemClick: (id: string) => void
  onCustomerMenuItemClick: (id: string) => void
  t: (key: string) => string
  dataTest?: string
}
