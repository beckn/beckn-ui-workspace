import {
  Contact,
  Person,
  Stop,
  State,
  Quote,
  Billing,
  Payment,
  Context,
  Item,
  Provider,
  Agent,
  Vehicle
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
  agent?: Agent
  vehicle?: Vehicle
  rateable?: boolean
  rating?: string
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

interface LocationInfo {
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

interface ContactInfo {
  email?: string
  phone: string
}

interface PersonInfo {
  name: string
}

interface StopInfo {
  location: LocationInfo
  contact: ContactInfo
}

interface DescriptorInfo {
  code: string
  name: string
}

interface StateInfo {
  descriptor: DescriptorInfo
}

interface PriceInfo {
  currency: string
  value: string
}

interface QuoteBreakupInfo {
  title: string
  price: PriceInfo
}

interface QuoteInfo {
  price: PriceInfo
  breakup: QuoteBreakupInfo[]
}

interface BillingInfo {
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

interface PaymentParamsInfo {
  amount: string
  currency: string
  bank_account_number: string
  bank_code: string
  bank_account_name: string
}

interface PaymentInfo {
  collected_by: string
  params: PaymentParamsInfo
  status: string
  type: string
  transaction_id: string
}

interface CancellationTermInfo {
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

interface ContextInfo {
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
  }
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface ItemInfo {
  id: string
  name: string
  code: string
  price: PriceInfo
  quantity: {
    selected: {
      measure: {
        value: string
        unit: string
      }
    }
  }
}

interface ProviderInfo {
  id: string
  name: string
  short_desc: string
  images: {
    url: string
  }[]
}

interface MessageInfo {
  orderId: string
  provider: ProviderInfo
  items: ItemInfo[]
  fulfillments: Fulfillment[]
  quote: QuoteInfo
  billing: BillingInfo
  payments: PaymentInfo[]
  cancellation_terms: CancellationTermInfo[]
}

export interface ConfirmResponseModel2 {
  context: ContextInfo
  message: MessageInfo
}
