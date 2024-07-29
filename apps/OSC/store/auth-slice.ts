import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { User } from '@beckn-ui/common'
import authApi from '@beckn-ui/common/src/services/User'

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
      .addMatcher(authApi.endpoints.login.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.user = action.payload.user
        state.jwt = action.payload.jwt
        state.isAuthenticated = true
        Cookies.set('authToken', state.jwt)
        Router.push('/')
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        console.log('rejected', action)
      }),
      builder
        .addMatcher(authApi.endpoints.register.matchPending, (state, action) => {
          console.log('pending', action)
        })
        .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
          console.log('fulfilled', action)
          state.user = action.payload.user
          state.jwt = action.payload.jwt
          Cookies.set('authToken', state.jwt)
          state.isAuthenticated = true
          Router.push('/')
        })
        .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const { logout, setCredentials } = slice.actions
export default slice.reducer
