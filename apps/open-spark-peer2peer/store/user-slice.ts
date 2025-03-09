import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  profileEditable: boolean
  tradeExecutionProcessed?: boolean
}

export interface UserRootState {
  user: UserState
}

const initialState: UserState = {
  profileEditable: false,
  tradeExecutionProcessed: false
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
    }
  }
})

export const { setProfileEditable, setTradeExecutionProcessed } = userSlice.actions
export default userSlice.reducer
