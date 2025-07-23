import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConfirmResponseModel, InitResponseModel, SelectResponseModel } from '../../lib/types'
import confirmApi from '../services/confirm'
import initApi from '../services/init'
import selectApi from '../services/select'

export interface CheckoutRootState {
  checkout: Checkout
}

export interface Checkout {
  initResponse: InitResponseModel[]
  confirmResponse: ConfirmResponseModel[]
  selectResponse: SelectResponseModel[]
  isBillingSame: boolean
  totalBillingItems: number
}

const initialState: Checkout = {
  initResponse: [],
  confirmResponse: [],
  selectResponse: [],
  isBillingSame: true,
  totalBillingItems: 0
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addInitResponse(state, action: PayloadAction<{ initResponse: InitResponseModel[] }>) {
      state.initResponse = action.payload.initResponse
    },
    setIsBillingSame(state, action: PayloadAction<{ isBillingSame: boolean }>) {
      state.isBillingSame = action.payload.isBillingSame
    },
    clearState(state) {
      state.initResponse = []
      state.confirmResponse = []
      state.totalBillingItems = 0
    },
    setTotalBillingItems(state, action: PayloadAction<{ totalBillingItems: number }>) {
      state.totalBillingItems = action.payload.totalBillingItems
    },
    resetInitResponse(state) {
      state.initResponse = []
      state.isBillingSame = true
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
