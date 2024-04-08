export type SelectItem = {
  id: string
  selected: { quantity: { count: number } }
}

export type SelectItems = SelectItem[]

export type SelectFulfillments = { id: string }[]

export type SelectOrder = {
  items: SelectItems
  provider: { id: string }
  fulfillments: SelectFulfillments
}

export type SelectContext = {
  transaction_id: string
  bpp_id: string
  bpp_uri: string
  domain: string
}

export type SelectSingleData = {
  context: SelectContext
  message: { orders: SelectOrder[] }
}

export type SelectData = SelectSingleData[]
