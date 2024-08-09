import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RiderState {
  isOnline: boolean
  currentLocation: PickUpDropOffModel
}

export interface RiderRootState {
  rider: RiderState
}

const initialState: RiderState = {
  isOnline: false,
  currentLocation: {
    address: '',
    geoLocation: { latitude: 0, longitude: 0 }
  }
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
    }
  }
})

export const { goOnline, goOffline, updateLocation } = riderSlice.actions
export default riderSlice.reducer
