import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SelectedOrderDetailsType = {
  orderIds: string[]
  bppIds: string[]
  bppUris: string[]
}

type SingleIdType = {
  orderId: string
  bppId: string
  bppUri: string
}

export interface Orders {
  selectedOrderDetails: SelectedOrderDetailsType
}

export interface OrdersRootState {
  orders: Orders
}

const initialState: Orders = {
  selectedOrderDetails: {
    orderIds: [],
    bppIds: [],
    bppUris: []
  }
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addSelectedOrder(state, action: PayloadAction<{ orderDetails: SingleIdType }>) {
      state.selectedOrderDetails.orderIds.push(action.payload.orderDetails.orderId)
      state.selectedOrderDetails.bppIds.push(action.payload.orderDetails.bppId)
      state.selectedOrderDetails.bppUris.push(action.payload.orderDetails.bppUri)
    }
  }
})
export const orderActions = orderSlice.actions

export default orderSlice.reducer
