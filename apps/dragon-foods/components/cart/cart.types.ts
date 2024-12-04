import { LoaderProps, TypographyProps, ButtonProps } from '@beckn-ui/molecules'
import { MouseEventHandler } from 'react'

export interface CartItemProps {
  id: string
  shortDesc: string
  sourceText: string
  providerName?: string
  className?: string
}

export interface CartListProps {
  cartItems: CartItemProps[]
}

export interface OrderSummaryProps {
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
    loader: LoaderProps
    emptyCard?: EmptyCardProps
    actionButton?: {
      dataTest?: string
      text: string
      handleOnClick: MouseEventHandler<HTMLButtonElement>
    }
  }
  className?: string
  isLoading?: boolean
  emptyText?: string
}
