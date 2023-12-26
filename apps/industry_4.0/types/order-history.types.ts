interface Descriptor {
  name: string
  short_desc: string
}

interface Tag {
  code: string
  list: { name: string; value: string }[]
  name: string
  display: boolean
}

interface Item {
  id: string
  name: string
  tags: Tag[]
  price: {
    value: string
    currency: string
  }
  long_desc: string
  short_desc: string
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
    currency: string
    value: string
  }
}

interface Attributes {
  order_id: string
  bpp_id: string
  bpp_uri: string
  currency: string
  delivery_status: string
  descriptor: Descriptor
  price: number
  billing: null
  fulfillments: null
  created_date: null
  last_updated_date: null
  quote: QuoteInfo
  transaction_id: string
  message_id: null
  payments: null
  items: Item
  createdAt: string
  updatedAt: string
  publishedAt: string
  domain: null
}

export interface orderHistoryData {
  id: number
  attributes: Attributes
}
