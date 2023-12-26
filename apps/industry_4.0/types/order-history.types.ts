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

interface Attributes {
  order_id: string
  bpp_id: string
  bpp_uri: string
  currency: null
  delivery_status: string
  descriptor: Descriptor
  price: null
  billing: null
  fulfillments: null
  created_date: null
  last_updated_date: null
  quote: null
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
