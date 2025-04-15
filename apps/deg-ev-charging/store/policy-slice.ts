import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PolicyDetailsRootState {
  policy: PolicyDetails
}

interface PolicyDetails {
  polygonGeolocation: Array<string>
}

export const initialState: PolicyDetails = {
  polygonGeolocation: []
}

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    setPolygonGeolocation(state, action: PayloadAction<any, any>) {
      state.polygonGeolocation = action.payload
    }
  }
})

export const policyActions = policySlice.actions

export default policySlice.reducer
