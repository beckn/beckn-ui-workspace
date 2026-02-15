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
  /** Raw Beckn 2.0 init response(s) for building confirm payload */
  initResponseRaw20: unknown[]
}

const initialState: Checkout = {
  initResponse: [],
  confirmResponse: [],
  selectResponse: [],
  isBillingSame: true,
  totalBillingItems: 0,
  initResponseRaw20: []
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
      state.selectResponse = []
      state.initResponseRaw20 = []
      state.totalBillingItems = 0
    },
    setTotalBillingItems(state, action: PayloadAction<{ totalBillingItems: number }>) {
      state.totalBillingItems = action.payload.totalBillingItems
    },
    resetInitResponse(state) {
      state.initResponse = []
      state.isBillingSame = true
    },
    setSelectResponse(state, action: PayloadAction<{ data: SelectResponseModel[] }>) {
      state.selectResponse = action.payload.data
    },
    setConfirmResponse(state, action: PayloadAction<{ data: ConfirmResponseModel[] }>) {
      state.confirmResponse = action.payload.data
    },
    setInitResponseRaw20(state, action: PayloadAction<{ data: unknown[] }>) {
      state.initResponseRaw20 = action.payload.data
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(initApi.endpoints.init.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(initApi.endpoints.init.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        if (Array.isArray((action.payload as { data?: unknown[] })?.data)) {
          state.initResponse = (action.payload as { data: InitResponseModel[] }).data
        }
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
        if (Array.isArray((action.payload as { data?: unknown[] })?.data)) {
          state.confirmResponse = (action.payload as { data: ConfirmResponseModel[] }).data
        }
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
          if (Array.isArray((action.payload as { data?: unknown[] })?.data)) {
            state.selectResponse = (action.payload as { data: SelectResponseModel[] }).data
          }
        })
        .addMatcher(selectApi.endpoints.select.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const checkoutActions = checkoutSlice.actions

export default checkoutSlice.reducer
