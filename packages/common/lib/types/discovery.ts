import { ParsedItemModel } from './beckn'

export interface Discovery {
  transactionId: string
  productList: ParsedItemModel[]
  selectedProduct: ParsedItemModel
}

export interface DiscoveryRootState {
  discovery: Discovery
}
