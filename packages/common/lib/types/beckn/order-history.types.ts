import { Descriptor, Item, Quote } from '../common'

interface Attributes {
  order_id: string
  bpp_id: string
  bpp_uri: string
  currency: string
  delivery_status: string
  descriptor: Descriptor
  price: number
  billing: null
  fulfillments: null
  created_date: null
  last_updated_date: null
  quote: Quote
  transaction_id: string
  message_id: null
  payments: null
  items: Item[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  domain: null
}

export interface orderHistoryData {
  id: number
  attributes: Attributes
}
