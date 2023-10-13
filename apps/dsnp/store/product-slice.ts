import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RetailItem } from '../lib/types/products'

const initialState: {
  productDetails: RetailItem
  encodedProduct: string
} = {
  productDetails: {},
  encodedProduct: ''
}

const productInfoSlice = createSlice({
  name: 'productInfo',
  initialState,
  reducers: {
    setProductDetails(state, action: PayloadAction<{ product: RetailItem; encodedProduct: string }>) {
      ;(state.productDetails = action.payload.product), (state.encodedProduct = action.payload.encodedProduct)
    }
  }
})
export const productInfoActions = productInfoSlice.actions

export default productInfoSlice.reducer
