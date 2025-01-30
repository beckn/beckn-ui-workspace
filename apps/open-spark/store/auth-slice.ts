import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@beckn-ui/common'
import extendedAuthApi from '@services/UserService'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { ROLE } from '@lib/config'

interface AuthState {
  user: null | User
  jwt: string | null
  isAuthenticated: boolean
  role: ROLE | null
}

export interface AuthRootState {
  auth: AuthState
}

const initialState: AuthState = {
  user: null,
  jwt: null,
  isAuthenticated: false,
  role: ROLE.CONSUMER
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('authToken')
      Cookies.remove('isVerified')
      Router.push('/signIn')
      return initialState
    },
    setCredentials: (state, { payload: { user, jwt } }: PayloadAction<{ user: User; jwt: string }>) => {
      state.user = user
      state.jwt = jwt
    },
    setRole: (state, action: PayloadAction<{ role: ROLE }>) => {
      state.role = action.payload.role
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(extendedAuthApi.endpoints.tradeLogin.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(extendedAuthApi.endpoints.tradeLogin.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.user = action.payload.user
        state.jwt = action.payload.jwt
        state.isAuthenticated = true
        Cookies.set('authToken', state.jwt)
        Cookies.set('isVerified', JSON.stringify(state.user?.isOtpVerified))
        const urlQuery = Router.query

        const hasNotQuery = JSON.stringify(urlQuery) === '{}'

        if (hasNotQuery) {
          if (state.user.isOtpVerified) {
            Router.push('/')
          } else {
            Router.push('/OTPVerification')
          }
        } else {
          Router.push({
            pathname: '/',
            query: { external_url: urlQuery.external_url }
          })
        }
      })
      .addMatcher(extendedAuthApi.endpoints.tradeLogin.matchRejected, (state, action) => {
        console.log('rejected', action)
      }),
      builder
        .addMatcher(extendedAuthApi.endpoints.tradeRegister.matchPending, (state, action) => {
          console.log('pending', action)
        })
        .addMatcher(extendedAuthApi.endpoints.tradeRegister.matchFulfilled, (state, action) => {
          console.log('fulfilled', action)
          state.user = action.payload.user
          state.jwt = action.payload.jwt
          Cookies.set('authToken', state.jwt)
          state.isAuthenticated = true
          Router.push('/')
        })
        .addMatcher(extendedAuthApi.endpoints.tradeRegister.matchRejected, (state, action) => {
          console.log('rejected', action)
        }),
      builder
        .addMatcher(extendedAuthApi.endpoints.verifyOtp.matchPending, (state, action) => {
          console.log('pending', action)
        })
        .addMatcher(extendedAuthApi.endpoints.verifyOtp.matchFulfilled, (state, action) => {
          console.log('fulfilled', action)
          // JSON.stringify(action.payload.user?.isOtpVerified)
          const verified = action.payload?.message === 'Otp Verified Successfully' ? true : false
          Cookies.set('isVerified', verified.toString())

          if (verified) {
            Router.push('/')
          } else {
            Router.back()
          }
        })
        .addMatcher(extendedAuthApi.endpoints.verifyOtp.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const { logout, setCredentials, setRole } = slice.actions
export default slice.reducer
