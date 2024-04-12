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
  value: number
  currency: string
}

interface Fulfillment {
  rateable: boolean
  tracking: boolean
  id?: string
  type?: string
  rating?: number
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

interface CancellationTerm {
  state: string
  cancellation_fee: {
    amount: Price
  }
}

interface Payment {
  collected_by: string
  params: any
  status: string
  type: string
}

export type PaymentData = Payment[]

interface Message {
  orderId: string
  provider: {
    id: string
    name: string
    short_desc: string
    long_desc: string
    rating: string
    images: Image[]
  }
  items: {
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
  fulfillments: Fulfillment[]
  quote: Quote
  billing: BillingAddress
  cancellation_terms: CancellationTerm[]
  payments: PaymentData
}

interface ConfirmResponseData {
  context: Context
  message: Message
}

export interface ConfirmResponseModel {
  data: ConfirmResponseData[]
}
