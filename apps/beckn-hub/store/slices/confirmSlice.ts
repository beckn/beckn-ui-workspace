/**
 * Confirm state slice. Stores confirm response.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ConfirmState {
  response: { context: Record<string, unknown>; message: { order: unknown } } | null
  isLoading: boolean
  error: string | null
}

const initialState: ConfirmState = {
  response: null,
  isLoading: false,
  error: null
}

const confirmSlice = createSlice({
  name: 'confirm',
  initialState,
  reducers: {
    setConfirmResponse(state, action: PayloadAction<ConfirmState['response']>) {
      state.response = action.payload
      state.error = null
    },
    setConfirmLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setConfirmError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearConfirm(state) {
      state.response = null
      state.error = null
    }
  }
})

export const confirmActions = confirmSlice.actions
export default confirmSlice.reducer
