/**
 * Select state slice. Stores select response.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SelectState {
  response: { context: Record<string, unknown>; message: { order: unknown } } | null
  isLoading: boolean
  error: string | null
}

const initialState: SelectState = {
  response: null,
  isLoading: false,
  error: null
}

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    setSelectResponse(state, action: PayloadAction<SelectState['response']>) {
      state.response = action.payload
      state.error = null
    },
    setSelectLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setSelectError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearSelect(state) {
      state.response = null
      state.error = null
    }
  }
})

export const selectActions = selectSlice.actions
export default selectSlice.reducer
