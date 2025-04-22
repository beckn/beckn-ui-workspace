import { Contact, PickUpDropOffModel } from '@beckn-ui/common'

interface BillingAddress {
  name: string
  email: string
  phone: string
}

export type InitItem = {
  id: string
}

export type InitItems = InitItem[]

export type InitFulfillments = {
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

export type InitOrder = {
  items: InitItems
  provider: { id: string }
  fulfillments: InitFulfillments[]
  customer: {
    person: {
      name: string
    }
    contact: Contact
  }
  billing: BillingAddress
}

export type InitContext = {
  transaction_id: string
  bpp_id: string
  bpp_uri: string
  domain: string
}

export type InitSingleData = {
  context: InitContext
  message: { orders: InitOrder[] }
}

export type InitData = InitSingleData[]
