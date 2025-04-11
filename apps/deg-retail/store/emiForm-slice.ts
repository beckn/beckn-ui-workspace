import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EMIFormState {
  country: string
  idNumber: string
  panCard: string
  aadhaar: string
  fullName: string
  dateOfBirth: Date | null
  mobileNumber: string
  loanTenure: string
}

const initialState: EMIFormState = {
  country: '',
  idNumber: '',
  panCard: '',
  aadhaar: '',
  fullName: '',
  dateOfBirth: null,
  mobileNumber: '',
  loanTenure: ''
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
