import { PickUpDropOffModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CabDetails, ParsedCabDataModel } from '@utils/cabDetails'

export interface RideDetailsModel {
  provider: ParsedCabDataModel
  cabDetail: CabDetails
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
}

export interface Discovery {
  selectedRide: RideDetailsModel
}

export interface DiscoveryRootState {
  discovery: Discovery
}

const initialState: Discovery = {
  selectedRide: {} as RideDetailsModel
}

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    addRide(
      state,
      action: PayloadAction<{
        rideDetails: {
          provider: ParsedCabDataModel
          cabDetail: CabDetails
          pickup: PickUpDropOffModel
          dropoff: PickUpDropOffModel
        }
      }>
    ) {
      state.selectedRide = action.payload.rideDetails
    }
  }
})
export const discoveryActions = discoverySlice.actions

export default discoverySlice.reducer
