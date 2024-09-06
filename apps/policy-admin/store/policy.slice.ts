import { ApplicableToType, PolicyType } from '@lib/types/metaData'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PolicyState {
  policyName: string
  policyType: PolicyType | ''
  policyOwner: string
  description: string
  country: string
  city: string
  policyDocuments: string
  applicableTo: ApplicableToType[]
  rules: Record<string, any> | null
  startDate: string
  endDate: string
  polygon: string[]
  isActivate: boolean
}

export interface PolicyRootState {
  policy: PolicyState
}

const initialState: PolicyState = {
  policyName: '',
  policyType: '',
  policyOwner: '',
  description: '',
  country: '',
  city: '',
  policyDocuments: '',
  applicableTo: [],
  rules: null,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  polygon: [],
  isActivate: true
}

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    clearPolicyMetaData: state => {
      return initialState
    },
    updatePolicyName: (state, action: PayloadAction<any>) => {
      state.policyName = action.payload
    },
    updatePolicyType: (state, action: PayloadAction<any>) => {
      state.policyType = action.payload
    },
    updatePolicyOwner: (state, action: PayloadAction<any>) => {
      state.policyOwner = action.payload
    },
    updateDescription: (state, action: PayloadAction<any>) => {
      state.description = action.payload
    },
    updateCountry: (state, action: PayloadAction<any>) => {
      state.country = action.payload
    },
    updateCity: (state, action: PayloadAction<any>) => {
      state.city = action.payload
    },
    updatepolicyDocuments: (state, action: PayloadAction<any>) => {
      state.policyDocuments = action.payload
    },
    updateApplicableTo: (state, action: PayloadAction<any>) => {
      state.applicableTo = action.payload
    },
    updateRules: (state, action: PayloadAction<any>) => {
      state.rules = action.payload
    },
    updateStartDate: (state, action: PayloadAction<any>) => {
      state.startDate = action.payload
    },
    updateEndDate: (state, action: PayloadAction<any>) => {
      state.endDate = action.payload
    },
    updatePolygon: (state, action: PayloadAction<any>) => {
      state.polygon = action.payload
    },
    updatePolicyActivationStatus: (state, action: PayloadAction<any>) => {
      state.isActivate = action.payload
    }
  }
})

export const {
  updateApplicableTo,
  updateCity,
  updateCountry,
  updateDescription,
  updateEndDate,
  updatePolicyName,
  updatePolicyOwner,
  updatePolicyType,
  updatePolygon,
  updateRules,
  updateStartDate,
  updatepolicyDocuments,
  updatePolicyActivationStatus,
  clearPolicyMetaData
} = policySlice.actions
export default policySlice.reducer
