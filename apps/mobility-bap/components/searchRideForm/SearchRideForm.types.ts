type Options = {
  label: string
  value: string
  tag: string
}

export interface SearchRideFormProps {
  cabDetails: {
    name: string
    waitTime: string
    fare: string
  }
  location: {
    pickup: string
    dropOff: string
  }
  optionsList: {
    rideTimeOptionsList: Options[]
    riderOptionsList: Options[]
  }
}

export interface CustomDropDownProps {
  items: {
    value: string
    label: string
    tag: string
  }[]
  value: string

  onChange: (newValue: string, tag: string) => void
}

export type SelectItem = {
  id: string
}

export type SelectItems = SelectItem[]

export type SelectFulfillments = {
  type: string
  start: {
    location: { gps: string }
  }
  end: {
    location: { gps: string }
  }
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
