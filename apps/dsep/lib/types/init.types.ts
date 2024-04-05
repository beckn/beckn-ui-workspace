import { CurrencyType } from '@beckn-ui/becknified-components'

interface Location {
  country: {
    name: string
    code: string
  }
  city: {
    name: string
    code: string
  }
}

interface Context {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: Location
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface Price {
  value: string
  currency: CurrencyType
}

interface Image {
  url: string
  size_type?: string
}

interface Provider {
  id: string
  name: string
  short_desc: string
  long_desc: string
  rating?: string
  images: Image
}

interface Measure {
  value: string
  unit: string
}

interface AvailableQuantity {
  count: number
  measure: Measure
}

interface Quantity {
  available: AvailableQuantity
}

interface Tag {
  display: boolean
  list: { value: string }[]
}

interface Item {
  id: string
  name: string
  short_desc: string
  long_desc: string
  price: Price
  quantity: Quantity
  tags: Tag[]
}

interface Fulfillment {
  rateable?: boolean
  tracking?: boolean
  id?: string
  type?: string
  rating?: string
}

interface QuoteBreakup {
  title: string
  price: Price
  item: {
    id: string
  }
}

interface Quote {
  price: Price
  breakup: QuoteBreakup[]
}

interface State {
  name: string
}

interface City {
  name: string
}

interface Billing {
  name: string
  address: string
  state: State
  city: City
  email: string
  phone: string
}

interface CancellationFee {
  amount: Price
}

interface CancellationTerms {
  state: string
  cancellation_fee: CancellationFee
}

interface Order {
  type: string
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  cancellation_terms: CancellationTerms[]
}

interface Message {
  order: Order
}

export interface InitResponseItem {
  context: Context
  message: Message
}

export interface InitResponseModel {
  data: InitResponseItem[]
}
