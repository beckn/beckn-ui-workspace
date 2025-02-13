import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EmiDetail {
  monthlyInstallment: number
  interestAmount: number
  annualInterestRate: number
  totalCost: number
}

interface ApiResponse {
  [key: string]: any
}

interface EmiCalculationState {
  planId?: string
  emiDetails: EmiDetail[]
  apiResponse: ApiResponse | null
}

const initialState: EmiCalculationState = {
  planId: '',
  emiDetails: [],
  apiResponse: null
}

const emiCalculationSlice = createSlice({
  name: 'selectedEmi',
  initialState,
  reducers: {
    setEmiDetails: (state, action: PayloadAction<{ planId?: string; emiDetails: EmiDetail[] }>) => {
      state.planId = action.payload.planId
      state.emiDetails = [...action.payload.emiDetails]
    },
    setApiResponse: (state, action: PayloadAction<ApiResponse>) => {
      state.apiResponse = action.payload.data ?? action.payload
    },
    resetEmiDetails: () => initialState
  }
})

export const { setEmiDetails, setApiResponse, resetEmiDetails } = emiCalculationSlice.actions
export default emiCalculationSlice.reducer
