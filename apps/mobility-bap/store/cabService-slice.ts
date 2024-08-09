import { CabServiceDetails } from '@lib/types/cabService'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CabDetails, ParsedCabDataModel } from '@utils/cabDetails'

export const initialState: CabServiceDetails = {
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
    }
  }
})

export const { setCabServiceProviders, setTotalCabs, setCabResultFound } = cabServiceSlice.actions
export default cabServiceSlice.reducer
