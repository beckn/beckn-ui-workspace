import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  orderObjectUrl: '',
  isFlowCityOfParis: false
}

const orderObjectUrlSlice = createSlice({
  name: 'orderObjectUrl',
  initialState,
  reducers: {
    addOrderObjectUrl(state, action: PayloadAction<string>) {
      state.orderObjectUrl = action.payload
    },
    setisFlowCityOfParis(state, action: PayloadAction<boolean>) {
      state.isFlowCityOfParis = action.payload
    }
  }
})

export const orderObjectUrlActions = orderObjectUrlSlice.actions
export default orderObjectUrlSlice.reducer
