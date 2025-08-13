import { Price, Tag, Fulfillment, Provider, Context, Item, Quote } from '../common'

interface Order {
  type: string
  quote: Quote
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
}

interface Message {
  order: Order
}

export interface SelectResponseModel {
  context: Context
  message: Message
}
