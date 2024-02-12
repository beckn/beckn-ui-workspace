import { CurrencyType } from '../../utilities/currencyFormat'
import { IProductDetails, RetailItem, TSlug } from './products'

export interface ICartProduct {
    image: any
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

export interface CartRetailItem extends RetailItem {
    quantity: number
    totalPrice: number
}

export interface CartItemForRequest extends CartRetailItem {
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
    items: CartRetailItem[]
    totalQuantity: number
    totalAmount: number
    currency: CurrencyType
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
