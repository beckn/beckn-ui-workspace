import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoLocationAddresModel } from 'lib/types/geoLocationSearchPage'
import { ParsedCabDataModel } from 'utilities/cabDetails'

interface RideDetailsModel {
  provider: ParsedCabDataModel
  pickup: GeoLocationAddresModel
  dropoff: GeoLocationAddresModel
}

export interface Discovery {
  transactionId: string
  selectedRide: RideDetailsModel
}

export interface DiscoveryRootState {
  discovery: Discovery
}

const initialState: Discovery = {
  transactionId: '',
  selectedRide: {} as RideDetailsModel
}

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    addTransactionId(state, action: PayloadAction<{ transactionId: string }>) {
      state.transactionId = action.payload.transactionId
    },
    addRide(
      state,
      action: PayloadAction<{
        rideDetails: {
          provider: ParsedCabDataModel
          pickup: GeoLocationAddresModel
          dropoff: GeoLocationAddresModel
        }
      }>
    ) {
      state.selectedRide = action.payload.rideDetails
    }
  }
})
export const discoveryActions = discoverySlice.actions

export default discoverySlice.reducer
