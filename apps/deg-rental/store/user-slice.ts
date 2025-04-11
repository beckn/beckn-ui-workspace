import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  profileEditable: boolean
  tradeExecutionProcessed?: boolean
  shouldShowInitialAlert?: boolean
}

export interface UserRootState {
  user: UserState
}

const initialState: UserState = {
  profileEditable: false,
  tradeExecutionProcessed: false,
  shouldShowInitialAlert: true
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
    }
  }
})

export const { setProfileEditable, setTradeExecutionProcessed, setShowInitialAlert } = userSlice.actions
export default userSlice.reducer
