import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initApi } from '@services/init'
import { confirmApi } from '@services/confirm'
import { selectApi } from '@services/select'

export interface CheckoutRootState {
  checkout: Checkout
}

export interface Checkout {
  initResponse: any
  confirmResponse: any
  selectResponse: any
  isBillingSame: boolean
}

const initialState: Checkout = {
  initResponse: {},
  confirmResponse: {},
  selectResponse: {},
  isBillingSame: true
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addInitResponse(state, action: PayloadAction<{ initResponse: any }>) {
      state.initResponse = action.payload.initResponse
    },
    setIsBillingSame(state, action: PayloadAction<{ isBillingSame: boolean }>) {
      state.isBillingSame = action.payload.isBillingSame
    },
    clearState(state) {
      state.initResponse = {}
      state.confirmResponse = {}
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
      }),
      builder
        .addMatcher(selectApi.endpoints.select.matchPending, (state, action) => {
          console.log('pending', action)
        })
        .addMatcher(selectApi.endpoints.select.matchFulfilled, (state, action) => {
          console.log('fulfilled', action)
          state.selectResponse = action.payload.data
        })
        .addMatcher(selectApi.endpoints.select.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const checkoutActions = checkoutSlice.actions

export default checkoutSlice.reducer
