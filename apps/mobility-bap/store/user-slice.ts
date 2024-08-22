import { PickUpDropOffModel } from '@beckn-ui/common'
import { UserGeoLocation, UserGeoLocationRootState } from '@lib/types/user'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const initialState: UserGeoLocation = {
  experienceType: '',
  pickup: {
    address: '',
    geoLocation: { latitude: 0, longitude: 0 }
  },
  dropoff: {
    address: '',
    geoLocation: { latitude: 0, longitude: 0 }
  }
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setPickUpLocation(state, action: PayloadAction<PickUpDropOffModel>) {
      state.pickup = action.payload
    },
    setDropOffLocation(state, action: PayloadAction<PickUpDropOffModel>) {
      state.dropoff = action.payload
    },
    setExperienceType(state, action: PayloadAction<string>) {
      state.experienceType = action.payload
    }
  }
})

export const { setPickUpLocation, setDropOffLocation, setExperienceType } = userInfoSlice.actions
export default userInfoSlice.reducer
