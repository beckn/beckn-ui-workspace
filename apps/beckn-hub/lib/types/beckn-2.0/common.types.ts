/**
 * Beckn 2.0 common types (order, items, fulfillment, etc.).
 * Plain keys for API payloads.
 */
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
  components?: Array<{ type?: string; value?: number; currency?: string; description?: string }>
}

export interface OrderItem {
  lineId?: string
  orderedItem: string
  acceptedOffer?: string | Record<string, unknown>
  quantity?: Quantity
  price?: Price
  orderItemAttributes?: Record<string, unknown>
}

export interface Fulfillment {
  id?: string
  type?: string
  state?: { descriptor?: { code?: string } }
  tracking?: boolean
  agent?: Record<string, unknown>
  [key: string]: unknown
}

export interface Payment {
  id?: string
  type?: string
  status?: string
  params?: Record<string, unknown>
  [key: string]: unknown
}

export interface OrderValue {
  value?: number
  currency?: string
  components?: Array<{ type?: string; value?: number; currency?: string }>
}

export interface Order {
  id?: string
  orderNumber?: string
  state?: string
  provider?: { id?: string; [key: string]: unknown }
  items?: OrderItem[]
  orderItems?: OrderItem[]
  fulfillment?: Fulfillment
  fulfillments?: Fulfillment[]
  payment?: Payment
  payments?: Payment[]
  orderValue?: OrderValue
  quote?: { price?: Price; [key: string]: unknown }
  [key: string]: unknown
}
