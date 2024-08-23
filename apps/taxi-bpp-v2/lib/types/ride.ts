import { PickUpDropOffModel } from '@beckn-ui/common'

export interface CustomerDetails {
  id: string
  first_name: string
  last_name: string
  email: string
  contact: string
}

export interface NewRideResponse {
  message: string
  data: RideData
}

export interface RideData {
  validOrders: ValidOrder[]
}

export interface ValidOrder {
  id: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  state_code: string
  state_value: string
  order_id: Order
  stops: Stop[]
  customer_id: CustomerDetails
}

export interface Order {
  id: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  status: string
  currency: string | null
  tax_amount: string | null
  total_amount: string | null
  billing_email: string | null
  payment_method: string | null
  payment_method_title: string | null
  transaction_id: string | null
  ip_address: string | null
  user_agent: string | null
  customer_note: string | null
  amount_without_tax: string | null
  domain: string
  order_transaction_id: string
  bap_id: string
  bap_uri: string
  items: Item[]
}

export interface Item {
  id: number
  name: string
  short_desc: string
  code: string
  long_desc: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  max_quantity: string | null
  min_quantity: string | null
  provider: Provider
}

export interface Provider {
  id: number
  provider_name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  short_desc: string
  long_desc: string
  provider_id: string | null
  provider_uri: string | null
  provider_rating: string
  domain_id: Domain
}

export interface Domain {
  id: number
  DomainName: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Stop {
  id: number
  gps: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  city_name: string
  state_code: string
  city_code: string
  country_name: string
  country_code: string
  state_name: string
  area_code: string
  address: string
  type: string
}
