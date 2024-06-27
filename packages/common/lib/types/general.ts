import { Descriptor, Tag, ImportedOrderItem, Fulfillment, Quote, Billing, Payment } from './common'

export interface FilterPropsModel {
  handleApplyFilter: (sortBy: string) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
}

export interface ImportOrderModel {
  id: string
  status: string
  provider: {
    id: string
    descriptor: Descriptor
    tags: Tag[]
  }
  items: ImportedOrderItem[]
  fulfillments: Fulfillment[]
  quote: Quote
  billing: Billing
  payments: Payment[]
  tags: Tag[]
  type: string
}

export type ImportOrderShoppingList = Array<string>

export interface FormErrors {
  name?: string
  mobileNumber?: string
  email?: string
  address?: string
  zipCode?: string
  password?: string
  flatNumber?: string
  street?: string
  city?: string
  state?: string
  country?: string
}

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}
