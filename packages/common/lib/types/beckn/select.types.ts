import { Price, Tag, Fulfillment, Provider, Context, Item } from '../common'

interface Order {
  type: string
  quote: {
    price: Price
  }
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
