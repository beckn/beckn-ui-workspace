import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoLocationAddresModel, IGeoLocationSearchPage } from '../lib/types/geoLocationSearchPage'

const initialState: IGeoLocationSearchPage = {
  geoLocationSearchPageVisible: false,
  pickup: {
    address: '',
    geoLatLong: { lat: 0, long: 0 }
  },
  dropoff: {
    address: '',
    geoLatLong: { lat: 0, long: 0 }
  }
}

const geoLocationSearchPage = createSlice({
  name: 'geoLocationSearchPageUI',
  initialState,
  reducers: {
    toggleLocationSearchPageVisibility(
      state,
      action: PayloadAction<{ visible: boolean; addressType: 'pickup' | 'dropoff' | '' }>
    ) {
      const { visible, addressType } = action.payload
      if (addressType === 'pickup') {
        state.pickup = {
          address: '',
          geoLatLong: { lat: 0, long: 0 }
        }
      } else if (addressType === 'dropoff') {
        state.dropoff = {
          address: '',
          geoLatLong: { lat: 0, long: 0 }
        }
      }
      state.geoLocationSearchPageVisible = visible
    },
    setPickupAddress(state, action: PayloadAction<GeoLocationAddresModel>) {
      state.pickup = action.payload
    },
    setDropoffAddress(state, action: PayloadAction<GeoLocationAddresModel>) {
      state.dropoff = action.payload
    },
    setGeoLatLong(state, action: PayloadAction<{ lat: number; long: number }>) {
      // state.geoLatLong = action.payload
    }
  }
})

export const { toggleLocationSearchPageVisibility, setPickupAddress, setDropoffAddress, setGeoLatLong } =
  geoLocationSearchPage.actions

export default geoLocationSearchPage.reducer
