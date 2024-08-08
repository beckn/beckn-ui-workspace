import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { IUser, IUserInfo, LocationInfo } from '../lib/types/user'

const initialState: IUserInfo = {
  location: {
    latitude: 0,
    longitude: 0
  },
  onlineStatus: false
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<LocationInfo>) {
      state.location = action.payload
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.onlineStatus = action.payload
    }
  }
})
export const userInfoActions = userInfoSlice.actions

export default userInfoSlice.reducer
