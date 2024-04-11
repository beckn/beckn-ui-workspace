interface Time {
  timestamp: string
}

interface Stop {
  time: Time
  type: string // "APPLICATION-START" | "APPLICATION-END"
}

interface Contact {
  email: string
  phone: string
}

interface CustomerPerson {
  name: string
  gender: string
}

interface Customer {
  person: CustomerPerson
}

interface TagListValue {
  code: string
  name: string
  value: string
}

interface TagList {
  code: string
  list: TagListValue[]
  name: string
  display: boolean
}

interface Price {
  value: number
  currency: string
}

interface Item {
  id: string
  name: string
  tags: TagList[]
  price: Price
  rateable: boolean
  long_desc: string
}

interface FulfillmentDescriptor {
  name: string
  short_desc: string
}

interface Fulfillment {
  id: string
  type: string // "SCHOLARSHIP"
  stops: Stop[]
  contact: Contact
  customer: Customer
  tracking: boolean
}

export interface OrderAttributes {
  order_id: string
  bpp_id: string
  bpp_uri: string
  currency?: string | null
  delivery_status: string
  descriptor: FulfillmentDescriptor
  price?: number | null
  billing?: any // Can be more specific type if information is available
  fulfillments: Fulfillment[]
  created_date?: any // Can be string or Date type depending on usage
  last_updated_date?: any // Can be string or Date type depending on usage
  quote?: any // Can be more specific type if information is available
  transaction_id: string
  message_id: string
  payments?: any // Can be more specific type if information is available
  items: Item[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  domain: string
}

export type Attributes = {
  attributes: OrderAttributes
  id: string
}

export type OrderData = Attributes[]
