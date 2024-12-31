import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'
import { ModalDetails } from '@lib/types/mapScreen'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  profileEditable: boolean
}

export interface UserRootState {
  user: UserState
}

const initialState: UserState = {
  profileEditable: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileEditable: (state, action: PayloadAction<{ profileEditable: boolean }>) => {
      state.profileEditable = action.payload.profileEditable
    }
  }
})

export const { setProfileEditable } = userSlice.actions
export default userSlice.reducer
