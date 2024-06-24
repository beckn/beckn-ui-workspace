import {
  Price,
  Contact,
  Person,
  Stop,
  Fulfillment,
  Provider,
  Context,
  Item,
  Billing,
  Payment,
  Quote,
  Tag
} from '../common'

interface StateDescriptor {
  code: string
  short_desc: string
}

interface State {
  descriptor: StateDescriptor
  updated_at: string
}

interface Customer {
  contact: Contact
  person: Person
}

interface CancellationTerms {
  cancellation_fee: {
    amount: Price
  }
}

interface Order {
  created_at: string
  id: string
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  payments: Payment[]
  cancellation_terms: CancellationTerms[]
  type: string
  status: string
  tags: Tag[]
}

interface Message {
  order: Order
}

export interface StatusResponseModel {
  length?: number
  context: Context
  message: Message
}

export interface SupportModel {
  phone: string
  email: string
}
