import { CurrentRideRequest } from '@lib/types/rideDetails'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RIDE_STATUS_CODE } from '@utils/ride-utils'
export interface RideStatusState {
  currentAcceptedRideRequest: CurrentRideRequest
  driverStatus: RIDE_STATUS_CODE
}

export interface RideStatusRootState {
  rideStatus: RideStatusState
}

const initialState: RideStatusState = {
  currentAcceptedRideRequest: {
    orderId: '',
    source: '',
    destination: '',
    distance: '',
    time: '',
    date: '',
    customerDetails: { contact: '', email: '', first_name: '', last_name: '', id: '' }
  },
  driverStatus: RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL
}

const rideStatusSlice = createSlice({
  name: 'rideStatus',
  initialState,
  reducers: {
    setNewRideRequest(state, action: PayloadAction<any>) {
      state.currentAcceptedRideRequest = action.payload
    },
    updateDriverStatus(state, action: PayloadAction<any>) {
      state.driverStatus = action.payload
    },
    clearRequest(state) {
      state.currentAcceptedRideRequest = {
        orderId: '',
        source: '',
        destination: '',
        distance: '',
        time: '',
        date: '',
        customerDetails: { contact: '', email: '', first_name: '', last_name: '', id: '' }
      }
      state.driverStatus = RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL
    }
  }
})

export const { setNewRideRequest, updateDriverStatus, clearRequest } = rideStatusSlice.actions

export default rideStatusSlice.reducer
