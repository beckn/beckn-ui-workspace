interface Price {
  currency: string
  value: string
}

interface Image {
  url: string
  size_type: string
}

interface Tag {
  code: string
  name: string
  display: boolean
  list?: Array<{
    name: string
    value: string
  }>
}

interface Item {
  id: string
  name: string
  price: Price
  tags: Tag[]
}

interface Provider {
  id: string
  name: string
  short_desc: string
  long_desc: string
  images: Image
}

interface Quote {
  price: Price
}

interface Order {
  type: string
  quote: Quote
  provider: Provider
  items: Item[]
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

interface Message {
  order: Order
}

export interface SelectResponseModel {
  context: Context
  message: Message
}
