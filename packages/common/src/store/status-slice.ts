import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatusResponseModel } from '../types/status.types'

export interface StatusRootState {
  status: Status
}

export interface Status {
  statusResponse: StatusResponseModel[]
}

const initialState: Status = {
  statusResponse: []
}

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    addStatusResponse(state, action: PayloadAction<{ statusResponse: StatusResponseModel[] }>) {
      state.statusResponse = action.payload.statusResponse
    }
  }
})

export const statusActions = statusSlice.actions

export default statusSlice.reducer
