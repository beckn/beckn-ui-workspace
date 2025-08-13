import { TypographyProps, ButtonProps, LoaderWithMessagePropsModel } from '@beckn-ui/molecules'
import { MouseEventHandler } from 'react'
import { CurrencyType, ProductPriceProps } from '../types'

export interface CartItemProps {
  id: string
  quantity: number
  name: string
  providerName?: string
  shortDesc?: string
  image: string
  price: number
  symbol: CurrencyType
  handleIncrement: (id: string) => void
  handleDecrement: (id: string) => void
  className?: string
  totalAmountText?: string
  alignment?: 'row' | 'column'
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
  dataTestText?: string
  dataTestTotalQuantity?: string
  dataTestTotalAmount?: string
  dataTestCta?: string
}
interface EmptyCardProps {
  image?: string
  heading?: string
  subHeading?: string
  buttonText?: string
  buttonHanler?: MouseEventHandler<HTMLButtonElement>
  dataTestImage?: string
  dataTestHeading?: string
  dataTestSubHeading?: string
  dataTestCta?: string
}
export interface CartProps {
  schema: {
    cartItems: CartItemProps[]
    loader: LoaderWithMessagePropsModel
    orderSummary: OrderSummaryProps
    emptyCard?: EmptyCardProps
  }
  className?: string
  isLoading?: boolean
  emptyText?: string
  dataTestCta?: string
}
