import { LoaderProps, TypographyProps, ButtonProps } from '@beckn-ui/molecules'
import { CurrencyType, ProductPriceProps } from '../types'
export interface RetailItem {
  extended_attributes?: any
  price: {
    listed_value?: string
    currency?: string
    value: string
  }
  matched?: boolean
  id: string
  descriptor: {
    images: string[]
    name: string
    short_desc: string
    long_desc: string
  }
  location_id?: string
  recommended?: boolean
  tags: {
    fulfillment_start_loc?: string
    Category?: string
    Trekking?: string
    Himalayas?: string
    fulfillment_end_time?: string
    Country?: string
    Ladakh?: string
    Treks?: string
    Package?: string
    Leh?: string
    fulfillment_end_loc?: string
    authorName: string
    rating: string
    foodType?: string
  }
}

export interface CartRetailItem extends RetailItem {
  quantity: number
  totalPrice: number
}

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
export interface EmptyCardProps {
  image?: string
  heading?: string
  subHeading?: string
  buttonText?: string
  buttonHanler?: (id: string) => void
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
