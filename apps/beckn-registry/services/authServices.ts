import { AuthResponse, LoginCredentials, RegisterCredentials } from '@lib/types/auth'
import api from './api'

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthResponse, LoginCredentials>({
      query: credentials => ({
        url: '/auth/local',
        method: 'POST',
        body: credentials
      })
    }),
    register: build.mutation<AuthResponse, RegisterCredentials>({
      query: credentials => ({
        url: '/signup',
        method: 'POST',
        body: credentials
      })
    }),
    verifyEmail: build.mutation<AuthResponse, string>({
      query: token => ({
        url: `/auth/email-confirmation?confirmation=${token}`,
        method: 'GET'
      })
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useVerifyEmailMutation } = authApi
