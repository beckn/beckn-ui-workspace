import { CurrencyType } from '@beckn-ui/becknified-components'

interface Location {
  city: {
    name: string
    code: string
  }
  country: {
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
  short_desc?: string
  long_desc?: string
  images?: Image
}

interface Quantity {
  available: {
    count: number
    measure?: {
      value: string
      unit: string
    }
  }
}

interface Category {
  id: string
  name: string
}

interface Tag {
  display: boolean
  list: (null | string)[]
  name?: string
  value?: string
}

interface XInput {
  url: string
  mime_type?: string
  html?: string
}

export interface Item {
  id: string
  xinput?: XInput
  name: string
  short_desc?: string
  long_desc?: string
  price: Price
  quantity?: Quantity
  categories?: Category[]
  tags: Tag[]
  rating?: string
  rateable?: boolean
  time?: {
    label: string
    duration: string
    range: {
      start: string
      end: string
    }
  }
}

interface Order {
  type: string
  quote?: {
    price: Price
  }
  provider: Provider
  items: Item[]
}

interface Message {
  order: Order
}

export interface SelectData {
  context: Context
  message: Message
}

export interface SelectResponseModel {
  data: SelectData[]
}
