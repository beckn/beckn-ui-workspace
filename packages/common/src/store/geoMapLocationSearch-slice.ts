import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoLocationType, IGeoLocationSearchPage } from '../../lib/types'

const initialState: IGeoLocationSearchPage = {
  geoLocationSearchPageVisible: false,
  currentGeoLocationType: '',
  geoAddress: '',
  geoLatLong: '',
  destinationGeoAddress: '',
  destinationGeoLatLong: ''
}
const geoLocationSearchPage = createSlice({
  name: 'geoLocationSearchPageUI',
  initialState,
  reducers: {
    toggleLocationSearchPageVisibility(
      state,
      action: PayloadAction<{ visible: boolean; addressType: GeoLocationType }>
    ) {
      const { visible, addressType } = action.payload
      state.geoLocationSearchPageVisible = visible
      state.currentGeoLocationType = addressType
    },
    setGeoAddressAndLatLong(
      state,
      action: PayloadAction<{
        geoAddress: string
        geoLatLong: string
      }>
    ) {
      if (state.currentGeoLocationType === 'pick-up' || state.currentGeoLocationType === '') {
        state.geoAddress = action.payload.geoAddress
        state.geoLatLong = action.payload.geoLatLong
      } else if (state.currentGeoLocationType === 'drop-off') {
        state.destinationGeoAddress = action.payload.geoAddress
        state.destinationGeoLatLong = action.payload.geoLatLong
      }
    }
  }
})

export const { toggleLocationSearchPageVisibility, setGeoAddressAndLatLong } = geoLocationSearchPage.actions

export default geoLocationSearchPage.reducer
