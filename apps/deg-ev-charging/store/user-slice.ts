import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  profileEditable: boolean
  tradeExecutionProcessed?: boolean
  shouldShowInitialAlert?: boolean
  currentLocation?: {
    latitude: number
    longitude: number
  }
}

export interface UserRootState {
  user: UserState
}

const initialState: UserState = {
  profileEditable: false,
  tradeExecutionProcessed: false,
  shouldShowInitialAlert: true,
  currentLocation: undefined
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
    setShowInitialAlert: (state, action: PayloadAction<boolean>) => {
      state.shouldShowInitialAlert = action.payload
    },
    setCurrentLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.currentLocation = action.payload
    }
  }
})

export const { setProfileEditable, setTradeExecutionProcessed, setShowInitialAlert, setCurrentLocation } =
  userSlice.actions
export default userSlice.reducer
