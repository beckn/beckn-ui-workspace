import { createSlice } from '@reduxjs/toolkit'
import { authReducerName, authReducerIntialState, authSliceCaseReducer } from '@beckn-ui/common'
import extendedAuthApi from '@services/user'
import Cookies from 'js-cookie'
import Router from 'next/router'

const slice = createSlice({
  name: authReducerName,
  initialState: authReducerIntialState(),
  reducers: authSliceCaseReducer,
  extraReducers: builder => {
    builder
      .addMatcher(extendedAuthApi.endpoints.driverLogin.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(extendedAuthApi.endpoints.driverLogin.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.user = action.payload.user
        state.jwt = action.payload.jwt
        state.isAuthenticated = true
        Cookies.set('authToken', state.jwt)
        const urlQuery = Router.query

        const hasNotQuery = JSON.stringify(urlQuery) === '{}'

        if (hasNotQuery) {
          Router.push('/')
        } else {
          Router.push({
            pathname: '/',
            query: { external_url: urlQuery.external_url }
          })
        }
      })
      .addMatcher(extendedAuthApi.endpoints.driverLogin.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
  }
})

export const { logout, setCredentials } = slice.actions
export default slice.reducer
