import {
  Location,
  Contact,
  Person,
  Stop,
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

interface Fulfillment {
  id: string
  type: string
  customer: {
    contact: Contact
    person: Person
  }
  stops: Stop[]
  state: State
  tracking: boolean
}

interface CancellationTerm {
  fulfillment_state: {
    descriptor: {
      code: string
    }
  }
  cancellation_fee: {
    percentage: string
  }
  external_ref: {
    mimetype: string
    url: string
  }
}

interface Message {
  orderId: string
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  payments: Payment[]
  cancellation_terms: CancellationTerm[]
}

export interface ConfirmResponseModel {
  context: Context
  message: Message
}
