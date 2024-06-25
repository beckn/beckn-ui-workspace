import { IProductDetails, TSlug, ICartProduct, Item } from './common'

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
