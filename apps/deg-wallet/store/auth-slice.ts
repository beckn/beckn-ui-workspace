import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@beckn-ui/common'
import Cookies from 'js-cookie'
import Router from 'next/router'
import extendedWalletApi from '@services/walletService'
import { RegisterSubject } from '@lib/types/becknDid'

interface AuthState {
  user: null | RegisterSubject
  privateKey: string
  publicKey: string
  isAuthenticated: boolean
}

export interface AuthRootState {
  auth: AuthState
}

const initialState: AuthState = {
  user: null,
  privateKey: '',
  publicKey: '',
  isAuthenticated: false
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('userDidAuth')
      Cookies.remove('isVerified')
      Router.push('/signIn')
      return initialState
    },
    setCredentials: (state, { payload: { user, jwt } }: PayloadAction<{ user: RegisterSubject; jwt: string }>) => {
      state.user = user
    },
    setPrivateKeyAndPublicKey: (
      state,
      { payload: { privateKey, publicKey } }: PayloadAction<{ privateKey: string; publicKey: string }>
    ) => {
      state.privateKey = privateKey
      state.publicKey = publicKey
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(extendedWalletApi.endpoints.registerLoginUser.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(extendedWalletApi.endpoints.registerLoginUser.matchFulfilled, (state, action) => {
        console.log('fulfilled', action)
        state.user = action.payload?.[0]
        state.isAuthenticated = true

        Cookies.set('isVerified', 'false')
        if (action.payload && action.payload.length > 0) {
          Cookies.set('userDidAuth', action.payload?.[0]?.did)

          Router.push('/OTPVerification')
        }
      })
      .addMatcher(extendedWalletApi.endpoints.registerLoginUser.matchRejected, (state, action) => {
        console.log('rejected', action)
      })
  }
})

export const { logout, setCredentials, setPrivateKeyAndPublicKey } = slice.actions
export default slice.reducer
