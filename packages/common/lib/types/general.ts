import { Descriptor, Tag, ImportedOrderItem, Fulfillment, Quote, Billing, Payment } from './common'

export interface FilterPropsModel {
  handleApplyFilter: (sortBy: string) => void
  handleResetFilter: () => void
  handleCancelFilter?: () => void
}

export interface ImportedOrderModel {
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

export type ImportedOrderShoppingList = Array<string>
