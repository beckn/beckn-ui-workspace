import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NavigationState {
  type: 'MY_STORE' | 'RENT_AND_HIRE' | null
}

const initialState: NavigationState = {
  type: null
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNavigationType: (state, action: PayloadAction<NavigationState['type']>) => {
      state.type = action.payload
    }
  }
})

export const { setNavigationType } = navigationSlice.actions
export default navigationSlice.reducer
