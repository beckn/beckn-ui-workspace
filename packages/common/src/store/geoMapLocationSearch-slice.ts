import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoLocationType, IGeoLocationSearchPage } from '../../lib/types'

const initialState: IGeoLocationSearchPage = {
  geoLocationSearchPageVisible: false,
  currentGeoLocationType: '',
  geoAddress: '',
  geoLatLong: '',
  country: '',
  destinationGeoAddress: '',
  destinationGeoLatLong: '',
  destinationCountry: ''
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
        country?: string
      }>
    ) {
      if (state.currentGeoLocationType === 'pick-up' || state.currentGeoLocationType === '') {
        state.geoAddress = action.payload.geoAddress
        state.geoLatLong = action.payload.geoLatLong
        state.country = action.payload.country || ''
      } else if (state.currentGeoLocationType === 'drop-off') {
        state.destinationGeoAddress = action.payload.geoAddress
        state.destinationGeoLatLong = action.payload.geoLatLong
        state.destinationCountry = action.payload.country || ''
      }
    },
    setSource(
      state,
      action: PayloadAction<{
        geoAddress: string
        geoLatLong: string
        country: string
      }>
    ) {
      state.geoAddress = action.payload.geoAddress
      state.geoLatLong = action.payload.geoLatLong
      state.country = action.payload.country
    },
    clearSource(state) {
      state.geoAddress = ''
      state.geoLatLong = ''
      state.country = ''
    },
    clearDestination(state) {
      state.destinationGeoAddress = ''
      state.destinationGeoLatLong = ''
      state.destinationCountry = ''
    }
  }
})

export const { toggleLocationSearchPageVisibility, setGeoAddressAndLatLong, setSource, clearSource, clearDestination } =
  geoLocationSearchPage.actions

export default geoLocationSearchPage.reducer
