import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '@services/authServices'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { AuthState } from '@lib/types/auth'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null
}

export interface AuthRootState {
  auth: AuthState
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('auth_token')
      Router.push('/signIn')
      return initialState
    },
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.jwt
        Cookies.set('auth_token', action.payload.jwt)
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addMatcher(authApi.endpoints.register.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, state => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, state => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      .addMatcher(authApi.endpoints.verifyEmail.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.verifyEmail.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(authApi.endpoints.verifyEmail.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Email verification failed'
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
