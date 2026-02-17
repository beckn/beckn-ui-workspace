/**
 * Init state slice. Stores init response.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface InitState {
  response: { context: Record<string, unknown>; message: { order: unknown } } | null
  isLoading: boolean
  error: string | null
}

const initialState: InitState = {
  response: null,
  isLoading: false,
  error: null
}

const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setInitResponse(state, action: PayloadAction<InitState['response']>) {
      state.response = action.payload
      state.error = null
    },
    setInitLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setInitError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearInit(state) {
      state.response = null
      state.error = null
    }
  }
})

export const initActions = initSlice.actions
export default initSlice.reducer
