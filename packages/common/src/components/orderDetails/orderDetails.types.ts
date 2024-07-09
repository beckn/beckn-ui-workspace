import { ConfirmResponseModel, DataState, Item, ProcessState, StatusResponseModel } from '../../../lib/types'
import { OrderCancellationModalProps, OrderMenuModalProps, TranslationProps } from '../types'

export interface OrderData {
  name: string
  status?: string
  items?: Array<Item>
  url?: string
  createdAt?: string
}

export interface ProgressSummaryProps extends TranslationProps {
  orderData: OrderData
  orderStatusMap: Array<any>
  isDelivered: boolean
  isCancelled: boolean
  currencyMap: any
  handleOpenOrderMenu: () => void
}

export interface OrderOverViewProps extends TranslationProps {
  orderData: OrderData
}

export interface OrderSummaryProps extends TranslationProps {
  orderDetails: {
    shipping: { name: string; address: string; phone: string }
    billing: { name: string; address: string; phone: string }
    statusData: StatusResponseModel[]
  }
}

export interface DetailsPanelProps {
  title: string
  name: {
    icon: string
    text: string
  }
  address: {
    icon: string
    text: string
  }
  mobile: {
    icon: string
    text: string
  }
  responsive?: boolean
}

export interface AllOrderDeliveredProps extends TranslationProps {
  handleOnRateUsClick: () => void
}

export interface OrderDetailsProps extends TranslationProps {
  apiUrl: string
  domain: string
  handleUpdateOrder: () => void
  allOrderDelivered: {
    handleOnRateUsClick: () => void
  }
  progressSummary: {
    currencyMap: Record<string, string>
  }
}
