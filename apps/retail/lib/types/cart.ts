import { IProductDetails, RetailItem, TSlug } from './products'
import { Item } from '@lib/types'

export interface ICartProduct {
  image: any
  id?: string
  name: string
  slug: TSlug
  price: number
  discount?: number
  brand: string
  category: string[]
  starRating: number
  isOffer?: boolean
  details?: IProductDetails[]
  registerDate?: string
  quantity: number
  totalPrice: number
}

export interface CartRetailItem extends Item {
  quantity: number
  totalPrice: number
}

export interface CartItemForRequest extends CartRetailItem {
  categories: any
  currency?: any
  bpp_id: string
  bpp_uri: string
  providerId: string
  locations: any
}

// export interface

export interface ICartUI {
  cartBoxIsVisible: boolean
}

export interface ICart {
  items: CartItemForRequest[]
  totalQuantity: number
  totalAmount: number
}

export type ItemPerBpp = Record<string, CartRetailItem[]>

//RootState interface => use for state type in useSelector hook

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

export type LocalStorageCartItem = {
  product: ICartProduct
  quantity: number
}

export type LocalStorageCart = LocalStorageCartItem[]

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
