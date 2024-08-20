import { Coordinate } from '@beckn-ui/common'
import { CabServiceDetails } from '@lib/types/cabService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CabDetails, ParsedCabDataModel } from '@utils/cabDetails'
import { CancelTokenSource } from 'axios'

export const initialState: CabServiceDetails = {
  cancelTokenSource: null,
  rideSearchInProgress: false,
  cabServiceProviders: [],
  totalCabs: 0,
  driverCurrentLocation: { latitude: 0, longitude: 0 }
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
    setCancelTokenSource(state, action: PayloadAction<CancelTokenSource>) {
      state.cancelTokenSource = action.payload
    },
    clearCancelTokenSource(state) {
      state.cancelTokenSource = null
    },
    setDriverCurrentLocation(state, action: PayloadAction<Coordinate>) {
      state.driverCurrentLocation = action.payload
    }
  }
})

export const {
  setCabServiceProviders,
  setTotalCabs,
  setCabResultFound,
  clearCancelTokenSource,
  setCancelTokenSource,
  setDriverCurrentLocation
} = cabServiceSlice.actions
export default cabServiceSlice.reducer
