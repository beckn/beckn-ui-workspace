import { Coordinate } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RiderState {
  isOnline: boolean
  currentLocation: Coordinate | null
}

export interface RiderRootState {
  rider: RiderState
}

const initialState: RiderState = {
  isOnline: false,
  currentLocation: null
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
    updateLocation: (state, action: PayloadAction<Coordinate>) => {
      state.currentLocation = action.payload
    }
  }
})

export const { goOnline, goOffline, updateLocation } = riderSlice.actions
export default riderSlice.reducer
