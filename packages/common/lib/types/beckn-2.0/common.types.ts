// Common types shared across multiple endpoints (select, init, confirm, etc.)

export interface Buyer {
  '@context': string
  '@type': string
  id: string
  role?: string
  displayName?: string
  telephone?: string
  email?: string
}

export interface Quantity {
  unitText?: string
  unitCode?: string
  unitQuantity?: number
  minQuantity?: number
  maxQuantity?: number
}

export interface Price {
  currency?: string
  value?: number
  applicableQuantity?: Quantity
  components?: OrderValueComponent[]
}

export interface OrderItemAttributes {
  '@context': string
  '@type': string
  [key: string]: unknown
}

export interface AcceptedOfferInItem {
  '@context': string
  '@type': string
  id: string
  descriptor: Record<string, unknown>
  provider: string
  items: string[]
  addOns?: string[]
  add0nItems?: string[]
  isActive?: boolean
  validity?: Record<string, unknown>
  price?: Price
  eligibleRegion?: Array<Record<string, unknown>>
  acceptedPaymentMethod?: string[]
  offerAttributes?: Record<string, unknown>
}

export interface OrderItem {
  lineId?: string
  orderedItem: string
  acceptedOffer?: AcceptedOfferInItem
  quantity?: Quantity
  price?: Price
  orderItemAttributes?: OrderItemAttributes
}

export interface AcceptedOffer {
  '@context': string
  '@type': string
  id: string
  descriptor: Record<string, unknown>
  provider: string
  items: string[]
  addOns?: string[]
  add0nItems?: string[]
  isActive?: boolean
  validity?: Record<string, unknown>
  price?: Price
  eligibleRegion?: Array<Record<string, unknown>>
  acceptedPaymentMethod?: string[]
  offerAttributes?: Record<string, unknown>
}

export interface OrderValueComponent {
  type?: string
  value?: number
  currency?: string
  description?: string
  [key: string]: unknown
}

export interface OrderValue {
  currency?: string
  value?: number
  applicableQuantity?: Quantity
  components?: OrderValueComponent[]
}

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'WALLET' | 'BANK_TRANSFER' | 'CASH' | 'APPLE_PAY'

export interface PaymentAmount {
  currency?: string
  value?: number
}

export interface Payment {
  '@context': string
  '@type': string
  id?: string
  paymentStatus?: string
  amount?: PaymentAmount
  paidAt?: string
  acceptedPaymentMethod?: PaymentMethod[]
}

export interface TrackingAction {
  id?: string
  url?: string
  // Additional properties allowed
  [key: string]: unknown
}

export interface DeliveryAttributes {
  // Note: Requires at least 2 properties, additional properties forbidden
  [key: string]: unknown
}

export interface Fulfillment {
  '@context': string
  '@type': string
  id?: string
  fulfillmentStatus?: string
  mode: string
  trackingAction?: TrackingAction
  deliveryAttributes?: DeliveryAttributes
}

export interface OrderAttributes {
  '@context': string
  '@type': string
  // Note: Requires at least 2 properties, additional properties allowed
  [key: string]: unknown
}

export interface Order {
  '@context': string
  '@type': string
  id?: string
  orderStatus: string
  orderNumber?: string
  seller: string
  buyer: Buyer
  orderItems: OrderItem[]
  acceptedOffers?: AcceptedOffer[]
  orderValue?: OrderValue
  invoice?: string
  payment?: Payment
  fulfillment?: Fulfillment
  orderAttributes?: OrderAttributes
}
