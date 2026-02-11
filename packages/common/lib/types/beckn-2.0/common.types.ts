// Common types shared across multiple endpoints (select, init, confirm, etc.)

export interface Buyer {
  '@context': string
  '@type': string
  'beckn:id': string
  'beckn:role'?: string
  'beckn:displayName'?: string
  'beckn:telephone'?: string
  'beckn:email'?: string
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
  'beckn:id': string
  'beckn:descriptor': Record<string, unknown>
  'beckn:provider': string
  'beckn:items': string[]
  'beckn:addOns'?: string[]
  'beckn:add0nItems'?: string[]
  'beckn:isActive'?: boolean
  'beckn:validity'?: Record<string, unknown>
  'beckn:price'?: Price
  'beckn:eligibleRegion'?: Array<Record<string, unknown>>
  'beckn:acceptedPaymentMethod'?: string[]
  'beckn:offerAttributes'?: Record<string, unknown>
}

export interface OrderItem {
  'beckn:lineId'?: string
  'beckn:orderedItem': string
  'beckn:acceptedOffer'?: AcceptedOfferInItem
  'beckn:quantity'?: Quantity
  'beckn:price'?: Price
  'beckn:orderItemAttributes'?: OrderItemAttributes
}

export interface AcceptedOffer {
  '@context': string
  '@type': string
  'beckn:id': string
  'beckn:descriptor': Record<string, unknown>
  'beckn:provider': string
  'beckn:items': string[]
  'beckn:addOns'?: string[]
  'beckn:add0nItems'?: string[]
  'beckn:isActive'?: boolean
  'beckn:validity'?: Record<string, unknown>
  'beckn:price'?: Price
  'beckn:eligibleRegion'?: Array<Record<string, unknown>>
  'beckn:acceptedPaymentMethod'?: string[]
  'beckn:offerAttributes'?: Record<string, unknown>
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
  'beckn:id'?: string
  'beckn:paymentStatus'?: string
  'beckn:amount'?: PaymentAmount
  'beckn:paidAt'?: string
  'beckn:acceptedPaymentMethod'?: PaymentMethod[]
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
  'beckn:id'?: string
  'beckn:fulfillmentStatus'?: string
  'beckn:mode': string
  trackingAction?: TrackingAction
  'beckn:deliveryAttributes'?: DeliveryAttributes
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
  'beckn:id'?: string
  'beckn:orderStatus': string
  'beckn:orderNumber'?: string
  'beckn:seller': string
  'beckn:buyer': Buyer
  'beckn:orderItems': OrderItem[]
  'beckn:acceptedOffers'?: AcceptedOffer[]
  'beckn:orderValue'?: OrderValue
  'beckn:invoice'?: string
  'beckn:payment'?: Payment
  'beckn:fulfillment'?: Fulfillment
  'beckn:orderAttributes'?: OrderAttributes
}
