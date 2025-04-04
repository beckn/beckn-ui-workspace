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

export interface ScRetailProduct {
  id: number
  sku: string | null
  downloadable: boolean | null
  min_price: string
  max_price: string | null
  on_sale: boolean | null
  stock_quantity: number
  stock_status: string | null
  rating_count: number | null
  average_rating: number | null
  total_sales: number | null
  tax_status: string | null
  tax_class: string | null
  virtual: boolean | null
  currency: string
  additional_fee: number | null
  base_fee: number | null
  quantity_unit: string
  trusted_source: boolean
  cred_required: boolean
  recurring: boolean
  createdAt: string
  updatedAt: string
  item_id: number
}

export interface OrderHistoryData {
  sc_retail_product: ScRetailProduct
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
