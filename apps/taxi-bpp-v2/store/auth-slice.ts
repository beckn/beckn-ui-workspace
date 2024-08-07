import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@beckn-ui/common'
import extendedAuthApi from '@services/UserService'
import Cookies from 'js-cookie'
import Router from 'next/router'

const initialState = {
  user: null,
  jwt: null,
  isAuthenticated: false
} as { user: null | User; jwt: string | null; isAuthenticated: boolean }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('authToken')
      Router.push('/signIn')
      return initialState
    },
    setCredentials: (state, { payload: { user, jwt } }: PayloadAction<{ user: User; jwt: string }>) => {
      state.user = user
      state.jwt = jwt
    }
  },
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
