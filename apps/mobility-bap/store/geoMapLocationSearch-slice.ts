import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGeoLocationSearchPage } from '../lib/types/geoLocationSearchPage'

const initialState: IGeoLocationSearchPage = {
  geoLocationSearchPageVisible: false,
  pickupAddress: '',
  dropoffAddress: '',
  geoLatLong: ''
}

const geoLocationSearchPage = createSlice({
  name: 'geoLocationSearchPageUI',
  initialState,
  reducers: {
    toggleLocationSearchPageVisibility(
      state,
      action: PayloadAction<{ visible: boolean; addressType: 'pickup' | 'dropoff' }>
    ) {
      const { visible, addressType } = action.payload
      if (addressType === 'pickup') {
        state.pickupAddress = ''
      } else if (addressType === 'dropoff') {
        state.dropoffAddress = ''
      }
      state.geoLocationSearchPageVisible = visible
    },
    setPickupAddress(state, action: PayloadAction<string>) {
      state.pickupAddress = action.payload
    },
    setDropoffAddress(state, action: PayloadAction<string>) {
      state.dropoffAddress = action.payload
    },
    setGeoLatLong(state, action: PayloadAction<string>) {
      state.geoLatLong = action.payload
    }
  }
})

export const { toggleLocationSearchPageVisibility, setPickupAddress, setDropoffAddress, setGeoLatLong } =
  geoLocationSearchPage.actions

export default geoLocationSearchPage.reducer
