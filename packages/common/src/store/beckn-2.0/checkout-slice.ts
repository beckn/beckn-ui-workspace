import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * Generic Beckn 2.0 checkout state.
 * Any app (EV charging, retail, etc.) can use this slice for Select -> Init -> Confirm flow.
 * Store raw 2.0 responses and optionally normalized (legacy) responses for compatibility.
 */
export interface CheckoutBeckn20State {
  /** Select response(s) – raw Beckn 2.0 SelectResponse */
  selectResponse: unknown[]
  /** Init response(s) – normalized to legacy shape if app uses getPaymentBreakDown etc. */
  initResponse: unknown[]
  /** Raw Beckn 2.0 InitResponse – used to build Confirm payload */
  initResponseRaw: unknown[]
  /** Confirm response(s) – normalized to legacy shape for order confirmation / history */
  confirmResponse: unknown[]
  isBillingSame: boolean
  totalBillingItems: number
}

const initialState: CheckoutBeckn20State = {
  selectResponse: [],
  initResponse: [],
  initResponseRaw: [],
  confirmResponse: [],
  isBillingSame: true,
  totalBillingItems: 0
}

const checkoutBeckn20Slice = createSlice({
  name: 'checkoutBeckn20',
  initialState,
  reducers: {
    setSelectResponse(state, action: PayloadAction<{ data: unknown[] }>) {
      state.selectResponse = action.payload.data
    },
    addInitResponse(state, action: PayloadAction<{ initResponse: unknown[] }>) {
      state.initResponse = action.payload.initResponse
    },
    setInitResponseRaw(state, action: PayloadAction<{ data: unknown[] }>) {
      state.initResponseRaw = action.payload.data
    },
    setConfirmResponse(state, action: PayloadAction<{ data: unknown[] }>) {
      state.confirmResponse = action.payload.data
    },
    setIsBillingSame(state, action: PayloadAction<{ isBillingSame: boolean }>) {
      state.isBillingSame = action.payload.isBillingSame
    },
    setTotalBillingItems(state, action: PayloadAction<{ totalBillingItems: number }>) {
      state.totalBillingItems = action.payload.totalBillingItems
    },
    resetInitResponse(state) {
      state.initResponse = []
      state.initResponseRaw = []
      state.isBillingSame = true
    },
    clearState(state) {
      state.selectResponse = []
      state.initResponse = []
      state.initResponseRaw = []
      state.confirmResponse = []
      state.totalBillingItems = 0
    }
  }
})

export const checkoutBeckn20Actions = checkoutBeckn20Slice.actions
export type CheckoutBeckn20RootState = { checkoutBeckn20: CheckoutBeckn20State }
export default checkoutBeckn20Slice.reducer
