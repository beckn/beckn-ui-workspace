export type SelectItem = {
  id: string
}

export type SelectItems = SelectItem[]

export type SelectFulfillments = {
  type: string
  stops: [
    {
      type: 'start'
      location: { gps: string }
    },
    {
      type: 'end'
      location: { gps: string }
    }
  ]
}

export type SelectOrder = {
  items: SelectItems
  provider: { id: string }
  fulfillments: SelectFulfillments[]
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
