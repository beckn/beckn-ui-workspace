import { createSlice } from '@reduxjs/toolkit'
import { scholarshipCartProps } from '../lib/types/scholarShipCart'

const initialState: scholarshipCartProps = {
  scholarshipId: '',
  scholarshipTitle: ''
}

const scholarshipCartSlice = createSlice({
  name: 'scholarshipCart',
  initialState,
  reducers: {
    setScholarshipId: (state, action) => {
      state.scholarshipId = action.payload
    },
    setScholarshipTitle: (state, action) => {
      state.scholarshipTitle = action.payload
    }
  }
})

export const scholarshipCartActions = scholarshipCartSlice.actions

export default scholarshipCartSlice.reducer
