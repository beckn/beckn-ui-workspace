interface Location {
  country: {
    code: string
  }
}

interface Images {
  url: string
  size_type: string
}

interface Provider {
  id: string
  name: string
  short_desc: string
  long_desc: string
  images: Images
}

interface Price {
  currency: string
  value: string
}

interface Tag {
  code: string
  name: string
  display: boolean
  list: { name: string; value: string }[]
}

interface Item {
  id: string
  name: string
  short_desc: string
  long_desc: string
  price: Price
  tags: Tag[]
}

interface StateDescriptor {
  code: string
  short_desc: string
}

interface State {
  descriptor: StateDescriptor
  updated_at: string
}

interface CustomerContact {
  email: string
  phone: string
}

interface Person {
  name: string
}

interface Customer {
  contact: CustomerContact
  person: Person
}

interface LocationInfo {
  gps: string
  address: string
  city: { name: string }
  country: { code: string }
  area_code: string
  state: { name: string }
}

interface Contact {
  phone: string
}

interface Stop {
  type: string
  location: LocationInfo
  contact: Contact
}

interface Fulfillment {
  id: string
  state: State
  customer: Customer
  stops: Stop[]
  tracking: boolean
}

interface Breakup {
  price: Price
  title: string
}

interface Quote {
  breakup: Breakup[]
  price: Price
}

interface Billing {
  name: string
  address: string
  state: { name: string }
  city: { name: string }
  email: string
  phone: string
}

interface Params {
  amount: string
  currency: string
  bank_account_number: string
  bank_code: string
  bank_account_name: string
}

interface Payment {
  collected_by: string
  params: Params
  status: string
  type: string
  transaction_id: string
}

interface CancellationTerms {
  cancellation_fee: {
    amount: Price
  }
}

interface Order {
  id: string
  provider: Provider
  items: Item
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  payments: Payment[]
  cancellation_terms: CancellationTerms[]
  type: string
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

interface Message {
  order: Order
}

export interface StatusResponseModel {
  context: Context
  message: Message
}

export interface SupportModel {
  phone: string
  email: string
}
