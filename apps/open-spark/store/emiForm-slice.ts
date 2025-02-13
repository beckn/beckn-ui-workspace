import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EMIFormState {
  country: string
  idNumber: string
}

const initialState: EMIFormState = {
  country: 'India',
  idNumber: ''
}

const emiFormSlice = createSlice({
  name: 'emiForm',
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<EMIFormState>>) => {
      return { ...state, ...action.payload }
    },
    resetForm: () => initialState
  }
})

export const emiFormActions = emiFormSlice.actions
export default emiFormSlice.reducer
