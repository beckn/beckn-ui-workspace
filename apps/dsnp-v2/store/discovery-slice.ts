import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ParsedItemModel } from '@lib/types'
import { toBinary } from '@utils/common-utils'

export interface Discovery {
  transactionId: string
  productList: ParsedItemModel[]
  selectedProduct: ParsedItemModel
  encodedProduct: string
}

export interface DiscoveryRootState {
  discovery: Discovery
}

const initialState: Discovery = {
  transactionId: '',
  productList: [],
  selectedProduct: {} as ParsedItemModel,
  encodedProduct: ''
}

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    addTransactionId(state, action: PayloadAction<{ transactionId: string }>) {
      state.transactionId = action.payload.transactionId
    },
    addProducts(state, action: PayloadAction<{ products: ParsedItemModel[] }>) {
      state.productList = action.payload.products
    },
    addSingleProduct(state, action: PayloadAction<{ product: ParsedItemModel }>) {
      state.selectedProduct = action.payload.product
      state.encodedProduct = window.btoa(toBinary(JSON.stringify(action.payload.product)))
    }
  }
})
export const discoveryActions = discoverySlice.actions

export default discoverySlice.reducer
