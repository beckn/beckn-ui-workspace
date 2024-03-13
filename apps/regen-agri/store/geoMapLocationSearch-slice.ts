import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGeoLocationSearchPage } from '../lib/types/geoLocationSearchPage'

const initialState: IGeoLocationSearchPage = {
    geoLocationSearchPageVisible: false,
    geoAddress: '',
    geoLatLong: '',
}
const geoLocationSearchPage = createSlice({
    name: 'geoLocationSearchPageUI',
    initialState,
    reducers: {
        toggleLocationSearchPageVisibility(
            state,
            action: PayloadAction<boolean>
        ) {
            state.geoLocationSearchPageVisible = action.payload
        },
        setGeoAddressAndLatLong(
            state,
            action: PayloadAction<{ geoAddress: string; geoLatLong: string }>
        ) {
            state.geoAddress = action.payload.geoAddress
            state.geoLatLong = action.payload.geoLatLong
        },
    },
})

export const { toggleLocationSearchPageVisibility, setGeoAddressAndLatLong } =
    geoLocationSearchPage.actions

export default geoLocationSearchPage.reducer
