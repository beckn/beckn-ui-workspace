import { LoaderProps } from '@beckn-ui/molecules'

export interface OrderHistoryProps {
  schema: {
    orderHistoryDetails: OrderHistoryDetailsProps[]
    loader: LoaderProps
  }
  isLoading?: boolean
  redirectTo?: string
  isEmptyText?: string
}

export interface OrderHistoryDetailsProps {
  createdAt: string
  orderId: string
  totalAmountWithSymbol: string
  quantity: number
  orderState: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}
