import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DiscoveryEmiPlanState {
  transactionId: string | null
  products: any[]
}

const initialState: DiscoveryEmiPlanState = {
  transactionId: null,
  products: []
}

const discoveryEmiPlanSlice = createSlice({
  name: 'discoveryEmiPlan',
  initialState,
  reducers: {
    addTransactionId: (state, action: PayloadAction<{ transactionId: string }>) => {
      state.transactionId = action.payload.transactionId
    },
    addProducts: (state, action: PayloadAction<{ products: any[] }>) => {
      state.products = action.payload.products
    }
  }
})

export const discoveryEmiPlanActions = discoveryEmiPlanSlice.actions
export default discoveryEmiPlanSlice.reducer
