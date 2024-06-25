import { CurrencyType } from '@beckn-ui/becknified-components'
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
    contact: Contact | ContactInfo
    person:
      | Person
      | {
          name: string
        }
  }
  stops: Array<Stop | StopInfo>
  tracking: boolean
}

interface OrderInfo {
  type: string
  provider:
    | Provider
    | {
        id: string
        name: string
        short_desc: string
        long_desc: string
        images: ImageInfo
      }
  items: Item | ItemInfo
  fulfillments: Array<FulfillmentInfo>
  quote: Quote | QuoteInfo
  billing: Billing | BillingInfo
  payments: Array<Payment | PaymentInfo>
}

interface MessageInfo {
  order: OrderInfo
}

type ProductInfo = {
  code: string
  name: string
  display: boolean
  list: Array<{
    name: string
    value: string
  }>
}

type ImageInfo = {
  url: string
  size_type: string
}

type ItemInfo = {
  id: string
  name: string
  price: {
    currency: CurrencyType
    value: string
  }
  tags: Array<ProductInfo>
}

type ContactInfo = {
  email: string
  phone: string
}

type LocationInfo = {
  gps: string
  address: string
  city: {
    name: string
  }
  country: {
    code: string
  }
  area_code: string
  state: {
    name: string
  }
}

type StopInfo = {
  type: string
  location: LocationInfo
  contact: {
    phone: string
  }
}

export type QuoteBreakupInfo = {
  price: {
    currency: CurrencyType
    value: string
  }
  title: string
}

type QuoteInfo = {
  breakup: Array<QuoteBreakupInfo>
  price: {
    currency: CurrencyType
    value: string
  }
}

type BillingInfo = {
  name: string
  address: string
  state: {
    name: string
  }
  city: {
    name: string
  }
  email: string
  phone: string
}

type PaymentInfo = {
  collected_by: string
  params: {
    amount: string
    currency: string
    bank_account_number: string
    bank_code: string
    bank_account_name: string
  }
  status: string
  type: string
  id: string
}

type ContextInfo = {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: {
    country: {
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

export type InitResponseModel = {
  context: ContextInfo
  message: MessageInfo
}
