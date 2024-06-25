import {
  Contact,
  Location,
  Stop,
  Person,
  State,
  Price,
  QuoteBreakup,
  Quote,
  Billing,
  Payment,
  Context,
  Item,
  Provider
} from '../common'

interface FulfillmentInfo {
  id: string
  customer: {
    contact: Contact
    person: Person
  }
  stops: Array<Stop>
  tracking: boolean
}

interface OrderInfo {
  type: string
  provider: Provider
  items: Item
  fulfillments: Array<FulfillmentInfo>
  quote: Quote
  billing: Billing
  payments: Array<Payment>
}

interface MessageInfo {
  order: OrderInfo
}

export interface InitResponseModel {
  context: Context
  message: MessageInfo
}
