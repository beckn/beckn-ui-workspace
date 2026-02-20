import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@beckn-ui/common'
import extendedAuthApi from '@services/UserService'
import Cookies from 'js-cookie'
import Router from 'next/router'

interface AuthState {
  user: null | User
  jwt: string | null
  isAuthenticated: boolean
}

export interface AuthRootState {
  auth: AuthState
}

const initialState: AuthState = {
  user: null,
  jwt: null,
  isAuthenticated: false
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('authToken')
      Cookies.remove('isVerified')
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('persist:root')
        localStorage.clear()
      }
      Router.push('/signIn')
      return initialState
    },
    setCredentials: (state, { payload: { user, jwt } }: PayloadAction<{ user: User; jwt: string }>) => {
      state.user = user
      state.jwt = jwt
    },
    updateUserDetails: (state, { payload: { user } }: PayloadAction<{ user: User }>) => {
      state.user = user
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
        Cookies.set('isVerified', 'true')

        Router.push('/')
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
          Cookies.set('isVerified', 'true')
          state.isAuthenticated = true

          let returnUrl = '/'
          if (typeof window !== 'undefined') {
            try {
              const stored = sessionStorage.getItem('authReturnUrl')
              if (stored && stored.startsWith('/')) {
                returnUrl = stored
                sessionStorage.removeItem('authReturnUrl')
              }
            } catch {
              // ignore
            }
          }
          Router.push(returnUrl)
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
            let returnUrl = '/'
            if (typeof window !== 'undefined') {
              try {
                const stored = sessionStorage.getItem('authReturnUrl')
                if (stored && stored.startsWith('/')) {
                  returnUrl = stored
                  sessionStorage.removeItem('authReturnUrl')
                }
              } catch {
                // ignore
              }
            }
            Router.push(returnUrl)
          } else {
            Router.back()
          }
        })
        .addMatcher(extendedAuthApi.endpoints.verifyOtp.matchRejected, (state, action) => {
          console.log('rejected', action)
        })
  }
})

export const { logout, setCredentials, updateUserDetails } = slice.actions
export default slice.reducer
