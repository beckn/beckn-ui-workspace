import { CurrencyType } from '@beckn-ui/becknified-components'

interface Context {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: {
    country: {
      name: string
      code: string
    }
    city: {
      name: string
      code: string
    }
  }
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface Image {
  url: string
  size_type: string
}

interface Measure {
  value: number
  unit: string
}

interface AvailableQuantity {
  count: number
  measure: Measure
}

interface TagList {
  value: string
}

interface Tag {
  display: boolean
  list: TagList[]
}

interface Price {
  value: string
  currency: CurrencyType
}

interface StopLocation {
  address: string
  city: { name: string }
  state: { name: string }
}

interface Stop {
  type: string // "end" in this case
  location: StopLocation
}

interface CustomerContact {
  email: string
}

interface Customer {
  contact: CustomerContact
}

interface FulfillmentStateDescriptor {
  code: string
  short_desc: string
}

interface FulfillmentState {
  descriptor: FulfillmentStateDescriptor
  updated_at: string
}

interface Fulfillment {
  state: FulfillmentState
  customer: Customer
  stops: Stop[]
  tracking: boolean
}

interface BreakupItem {
  title: string
  price: Price
  item?: { id: string } // Optional for breakup items without item id
}

interface QuoteBreakup {
  [key: string]: BreakupItem // Index signature for dynamic breakup items
}

interface Quote {
  price: Price
  breakup: QuoteBreakup
}

interface BillingAddress {
  name: string
  address: string
  state: { name: string }
  city: { name: string }
  email: string
  phone: string
}

interface Payment {
  collected_by: string
  status: string
  type: string
}

interface CancellationTerm {
  state: string
  cancellation_fee: {
    amount: Price
  }
}

export interface StatusItem {
  id: string
  name: string
  code: string
  short_desc: string
  long_desc: string
  price: Price
  quantity: {
    available: AvailableQuantity
  }
  tags: Tag[]
}

interface Order {
  id: string
  provider: {
    id: string
    name: string
    short_desc: string
    long_desc: string
    rating: string
    images: Image // Single image object here
    rateable: boolean
  }
  items: StatusItem[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: BillingAddress
  payments: Payment[]
  cancellation_terms: CancellationTerm[]
  type: string // "DEFAULT" in this case
}

interface Message {
  order: Order
}

export interface StatusData {
  context: Context
  message: Message
}

export interface StatusResponseModel {
  data: StatusData[]
}
