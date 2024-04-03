import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initApi } from '@services/init'
import { confirmApi } from '@services/confirm'

export interface CheckoutRootState {
  checkout: Checkout
}

export interface Checkout {
  initResponse: any
  confirmResponse: any
}

const initialState: Checkout = {
  initResponse: {},
  confirmResponse: {}
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addInitResponse(state, action: PayloadAction<{ initResponse: any }>) {
      state.initResponse = action.payload.initResponse
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(initApi.endpoints.init.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(initApi.endpoints.init.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.initResponse = action.payload.data
      })
      .addMatcher(initApi.endpoints.init.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
    builder
      .addMatcher(confirmApi.endpoints.confirm.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(confirmApi.endpoints.confirm.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.confirmResponse = action.payload.data
      })
      .addMatcher(confirmApi.endpoints.confirm.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
  }
})

export const checkoutActions = checkoutSlice.actions

export default checkoutSlice.reducer
