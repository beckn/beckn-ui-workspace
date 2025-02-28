import { CurrencyType } from '@beckn-ui/becknified-components'

// ------------------------------------------------- beckn specific -------------------------------------------------
export interface Location {
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

export interface Person {
  name: string
}

export interface State {
  descriptor: Descriptor
  updated_at: string
}

export interface Price {
  currency: CurrencyType
  value: string
  rateLabel?: string
}

export interface QuoteBreakup {
  title: string
  price: Price
  item?: { id: string }
}

export interface Quote {
  price: Price
  breakup: QuoteBreakup[]
}

export interface Billing {
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

export interface PaymentParams {
  amount: string
  currency: string
  bank_account_number: string
  bank_code: string
  bank_account_name: string
  transaction_id: string
}

export interface Context {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: {
    country: {
      name?: string
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

export interface QuantityDetails {
  selected: {
    measure: {
      value: string
      unit: string
    }
    count: number
  }
  available: {
    count: number
  }
}

export interface Item {
  id: string
  name: string
  code?: string
  price: Price
  quantity?: QuantityDetails | number
  tags?: Tag[]
  long_desc?: string
  short_desc?: string
  images?: Image[]
  fulfillments: Fulfillment[]
  rating?: string
  locations?: Location[] | Coordinate
  productInfo?: Record<string, any> | string
  infoGuideIcon?: string
}

export interface Tag {
  code: string
  name: string
  descriptor: Descriptor
  display: boolean
  list?: Array<{
    name: string
    value: string
    display: boolean
    descriptor: Descriptor
  }>
}

export interface Provider {
  id: string
  name: string
  short_desc?: string
  long_desc?: string
  images: Image[]
}

export interface Fulfillment {
  id: string
  type: string
  customer: {
    contact: Contact
    person: Person
  }
  stops: Stop[]
  state: State
  tracking: boolean
  tags: Tag[]
}

export interface Coordinate {
  latitude: number
  longitude: number
}

// ------------------------------------------------- component specific -------------------------------------------------

export interface Descriptor {
  name: string
  short_desc?: string
  long_desc?: string
  code?: string
}

export interface Image {
  url: string
}

export interface Payment {
  id: string
  name: string
  status: string
  type: string
  params: PaymentParams
  time: {
    label: string
    timestamp: string
  }
  collected_by: string
  transaction_id: string
}

export interface Contact {
  name: string
  phone: string
  email: string
}

export interface Stop {
  location: Location
  contact: Contact
}

export interface ImportedOrderItem {
  id: string
  descriptor: {
    name: string
    long_desc: string
    images: Image[]
  }
  price: {
    listed_value: string
    currency: string
    value: string
  }
  quantity: {
    selected: {
      count: number
    }
  }
  fulfillment_ids: string[]
  tags: Tag[]
}

export interface IProductDetails {
  processor?: string
  screen?: string
  operating_system?: string
  ram?: string
  ssd?: string
  ports?: string
  graphic?: string
  warranty?: string
  back_camera?: string
  front_camera?: string
  battery?: string
  frequency_response?: string
  microphone?: boolean
  wireless?: boolean
  wireless_standby_time?: boolean
  connectionType?: string[]
  connectors?: string[]
  bluetooth?: boolean
  noise_cancelling?: boolean
  sound_isolating?: boolean
}

export type TSlug = {
  _type: string
  current: string
}

export interface ICartProduct {
  image: any
  id?: string
  name: string
  slug: TSlug
  price: number
  discount?: number
  brand: string
  category: string[]
  starRating: number
  isOffer?: boolean
  details?: IProductDetails[]
  registerDate?: string
  quantity: number
  totalPrice: number
}

export interface Agent {
  contact: {
    phone: string
    email: string
  }
  person: {
    id: string
    name: string
  }
  id: string
}

export interface Vehicle {
  make: string
  model: string
  registration: string
}
