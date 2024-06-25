import { LoaderProps, TypographyProps, ButtonProps } from '@beckn-ui/molecules'
import { MouseEventHandler } from 'react'
import { CurrencyType, ProductPriceProps } from '../types'

export interface CartItemProps {
  id: string
  quantity: number
  name: string
  image: string
  price: number
  symbol: CurrencyType
  handleIncrement: (id: string) => void
  handleDecrement: (id: string) => void
  className?: string
  totalAmountText?: string
}

export interface CartListProps {
  cartItems: CartItemProps[]
}

export interface OrderSummaryProps {
  totalQuantity: TypographyProps
  totalAmount: ProductPriceProps
  pageCTA: ButtonProps
  orderSummaryText?: string
  totalQuantityText?: string
  totalAmountText?: string
}
interface EmptyCardProps {
  image?: string
  heading?: string
  subHeading?: string
  buttonText?: string
  buttonHanler?: MouseEventHandler<HTMLButtonElement>
}
export interface CartProps {
  schema: {
    cartItems: CartItemProps[]
    loader: LoaderProps
    orderSummary: OrderSummaryProps
    emptyCard?: EmptyCardProps
  }
  className?: string
  isLoading?: boolean
  emptyText?: string
}
