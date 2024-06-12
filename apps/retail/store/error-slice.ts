import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ErrorRootState = {
  hasError: boolean
  message: string
}

const initialState: ErrorRootState = {
  hasError: false,
  message: ''
}

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    toggleError(state, action: PayloadAction<{ hasError: boolean; message: string }>) {
      state.hasError = action.payload.hasError
      state.message = action.payload.message
    }
  }
})

export const errorActions = errorSlice.actions

export default errorSlice.reducer
