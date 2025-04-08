export interface Descriptor {
  name: string
  short_desc: string
}

export interface Price {
  value: number | string
  currency: string
}

export interface Payment {
  type: string
  params: {
    price: string
    currency: string
    bank_code?: string
    bank_account?: string
    bank_account_name?: string
  }
  status: string
  collected_by: string
}

export interface Fulfillment {
  id: string
  type: string
  state: {
    code: string
    name: string
  }
}

export interface Quantity {
  available: {
    count: number
    measure: {
      unit: string
      value: string
    }
  }
}

export interface Image {
  url: string
  size_type: string
}

export interface Item {
  id: string
  code: string
  name: string
  price: Price
  images: Image[]
  rating: string
  quantity: Quantity
  rateable: boolean
  long_desc: string
  short_desc: string
  fulfillments: Fulfillment[]
}

export interface OrderHistoryData {
  id: number
  order_id: string
  bpp_id: string
  bpp_uri: string
  currency: string
  delivery_status: string | null
  descriptor: Descriptor
  price: number
  billing: unknown | null
  fulfillments: unknown | null
  created_date: string | null
  last_updated_date: string | null
  quote: {
    price: Price
  }
  transaction_id: string
  message_id: string | null
  payments: Payment[]
  items: Item[]
  domain: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
}
