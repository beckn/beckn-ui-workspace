import confirmApi from '@beckn-ui/common/src/services/confirm'
import initApi from '@beckn-ui/common/src/services/init'
import selectApi from '@beckn-ui/common/src/services/select'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SelectRideRootState {
  SelectRide: SelectRide
}

export interface SelectRide {
  initResponse: any
  confirmResponse: any
  selectResponse: any
}

const initialState: SelectRide = {
  initResponse: {},
  confirmResponse: {},
  selectResponse: {}
}

const selectRideSlice = createSlice({
  name: 'selectRide',
  initialState,
  reducers: {
    addInitResponse(state, action: PayloadAction<{ initResponse: any }>) {
      state.initResponse = action.payload.initResponse
    },
    clearState(state) {
      state.initResponse = {}
      state.confirmResponse = {}
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(initApi.endpoints.init.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(initApi.endpoints.init.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.initResponse = action.payload.data
      })
      .addMatcher(initApi.endpoints.init.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
    builder
      .addMatcher(confirmApi.endpoints.confirm.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(confirmApi.endpoints.confirm.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.confirmResponse = action.payload.data
      })
      .addMatcher(confirmApi.endpoints.confirm.matchRejected, (state, action) => {
        console.log('rejected', action)
      }),
      builder
        .addMatcher(selectApi.endpoints.select.matchPending, (state, action) => {
          console.log('pending', action)
        })
        .addMatcher(selectApi.endpoints.select.matchFulfilled, (state, action) => {
          console.log('fulfilled', action)
          state.selectResponse = action.payload.data
        })
        .addMatcher(selectApi.endpoints.select.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const checkoutActions = selectRideSlice.actions

export default selectRideSlice.reducer
