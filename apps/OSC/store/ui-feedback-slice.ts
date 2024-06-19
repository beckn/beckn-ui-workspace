import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ToastType = 'error' | 'success' | 'info'

type Toast = {
  message: string
  display: boolean
  type?: ToastType
  description?: string
}

export type FeedbackRootState = {
  feedback: FeedbackState
}

export type FeedbackState = {
  toast: Toast
}

const toastInitialState: Toast = {
  message: '',
  display: false,
  type: 'error',
  description: ''
}

const initialState: FeedbackState = {
  toast: toastInitialState
}

const feedbackSlice = createSlice({
  name: 'ui-feedback',
  initialState,
  reducers: {
    setToastData(state, action: PayloadAction<{ toastData: Toast }>) {
      state.toast = action.payload.toastData
    },
    toggleToast(state, action: PayloadAction<{ display: boolean }>) {
      state.toast.display = action.payload.display
    }
  }
})

export const feedbackActions = feedbackSlice.actions

export default feedbackSlice.reducer
