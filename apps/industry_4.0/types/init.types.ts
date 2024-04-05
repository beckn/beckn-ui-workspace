import { CurrencyType } from '@beckn-ui/becknified-components'

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
    currency: string
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

type FulfillmentInfo = {
  id: string
  customer: {
    contact: ContactInfo
    person: {
      name: string
    }
  }
  stops: Array<StopInfo>
  tracking: boolean
}

type QuoteBreakupInfo = {
  price: {
    currency: string
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
}

type OrderInfo = {
  type: string
  provider: {
    id: string
    name: string
    short_desc: string
    long_desc: string
    images: ImageInfo
  }
  items: ItemInfo
  fulfillments: Array<FulfillmentInfo>
  quote: QuoteInfo
  billing: BillingInfo
  payments: Array<PaymentInfo>
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

type MessageInfo = {
  order: OrderInfo
}

export type InitResponseModel = {
  context: ContextInfo
  message: MessageInfo
}
