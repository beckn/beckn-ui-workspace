import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  profileEditable: boolean
  tradeExecutionProcessed?: boolean
  preferences: { [key: string]: boolean }
}

export interface UserRootState {
  user: UserState
}

interface PreferencesTags {
  trustedSource: boolean
  credRequired: boolean
  [key: string]: boolean
}

const preferencesTags: PreferencesTags = {
  trustedSource: false,
  credRequired: true
}

const initialState: UserState = {
  profileEditable: false,
  tradeExecutionProcessed: false,
  preferences: preferencesTags
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileEditable: (state, action: PayloadAction<{ profileEditable: boolean }>) => {
      state.profileEditable = action.payload.profileEditable
    },
    setTradeExecutionProcessed: (state, action: PayloadAction<boolean>) => {
      state.tradeExecutionProcessed = action.payload
    },
    setPreferences: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.preferences = action.payload
    }
  }
})

export const { setProfileEditable, setTradeExecutionProcessed, setPreferences } = userSlice.actions

export default userSlice.reducer
