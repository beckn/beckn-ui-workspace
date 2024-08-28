import { CabServiceDetails } from '@lib/types/cabService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CabDetails, ParsedCabDataModel } from '@utils/cabDetails'

export const initialState: CabServiceDetails = {
  cancelTokenSource: null,
  rideSearchInProgress: false,
  cabServiceProviders: [],
  totalCabs: 0
}

const cabServiceSlice = createSlice({
  name: 'cabService',
  initialState,
  reducers: {
    setCabResultFound(state, action: PayloadAction<boolean>) {
      state.rideSearchInProgress = action.payload
    },
    setCabServiceProviders(state, action: PayloadAction<ParsedCabDataModel[]>) {
      state.cabServiceProviders = action.payload
    },
    setTotalCabs(state, action: PayloadAction<number>) {
      state.totalCabs = action.payload
    },
    setCancelTokenSource(state, action: PayloadAction<any>) {
      state.cancelTokenSource = action.payload
    },
    clearCancelTokenSource(state) {
      state.cancelTokenSource = null
    }
  }
})

export const { setCabServiceProviders, setTotalCabs, setCabResultFound, clearCancelTokenSource, setCancelTokenSource } =
  cabServiceSlice.actions
export default cabServiceSlice.reducer
