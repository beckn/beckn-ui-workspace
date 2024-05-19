interface Location {
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

interface Contact {
  email?: string
  phone: string
}

interface Person {
  name: string
}

interface Stop {
  location: Location
  contact: Contact
}

interface Descriptor {
  code: string
  name: string
}

interface State {
  descriptor: Descriptor
}

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

interface Price {
  currency: string
  value: string
}

interface QuoteBreakup {
  title: string
  price: Price
}

interface Quote {
  price: Price
  breakup: QuoteBreakup[]
}

interface Billing {
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

interface PaymentParams {
  amount: string
  currency: string
  bank_account_number: string
  bank_code: string
  bank_account_name: string
}

interface Payment {
  collected_by: string
  params: PaymentParams
  status: string
  type: string
  transaction_id: string
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
  }
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface Item {
  id: string
  name: string
  code: string
  price: Price
  quantity: {
    selected: {
      measure: {
        value: string
        unit: string
      }
    }
  }
}

interface Provider {
  id: string
  name: string
  short_desc: string
  images: {
    url: string
  }[]
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
