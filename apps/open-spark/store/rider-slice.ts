import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { ModalDetails } from '@lib/types/mapScreen'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RiderState {
  isOnline: boolean
  currentLocation: PickUpDropOffModel
  currentRideRequest: ModalDetails | undefined
}

export interface RiderRootState {
  rider: RiderState
}

const initialState: RiderState = {
  isOnline: false,
  currentLocation: {
    address: '',
    geoLocation: { latitude: 0, longitude: 0 }
  },
  currentRideRequest: undefined
}

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    goOnline: state => {
      state.isOnline = true
    },
    goOffline: state => {
      state.isOnline = false
    },
    updateLocation: (state, action: PayloadAction<PickUpDropOffModel>) => {
      state.currentLocation = action.payload
    },
    setCurrentRideRequest: (state, action: PayloadAction<ModalDetails | undefined>) => {
      state.currentRideRequest = action.payload
    }
  }
})

export const { goOnline, goOffline, updateLocation, setCurrentRideRequest } = riderSlice.actions
export default riderSlice.reducer
