import { CurrencyType, ProductPriceProps } from '@beckn-ui/becknified-components'
import { ButtonProps, LoaderProps, TypographyProps } from '@beckn-ui/molecules/src/components/types'
import { MouseEventHandler } from 'react'
import { Coordinate, Item } from './common'

export interface CartRetailItem extends Item {
  quantity: number
  totalPrice: number
}

export interface CartItemForRequest extends CartRetailItem {
  categories?: any
  currency?: any
  bpp_id: string
  bpp_uri: string
  providerId: string
  locations: Coordinate
}

export interface ICartUI {
  cartBoxIsVisible: boolean
}

export interface ICart {
  items: CartItemForRequest[]
  totalQuantity: number
  totalAmount: number
}

export type ItemPerBpp = Record<string, CartRetailItem[]>

export interface ICartUiRootState {
  cartUi: ICartUI
}

export interface ICartRootState {
  cart: ICart
}

export interface TransactionIdRootState {
  transactionId: string
}

export interface DataPerBpp {
  [key: string]: CartItemForRequest[]
}

export type SelectItem = {
  id: string
  quantity: { selected: { count: number } }
}

export type SelectItems = SelectItem[]

export type SelectFulfillments = { id: string }[]

export type SelectOrder = {
  items: SelectItems
  provider: { id: string }
  fulfillments: SelectFulfillments
}

export type SelectContext = {
  transaction_id: string
  bpp_id: string
  bpp_uri: string
  domain: string
}

export type SelectSingleData = {
  context: SelectContext
  message: { orders: SelectOrder[] }
}

export type SelectData = SelectSingleData[]

// ------ components -----------------------------
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
