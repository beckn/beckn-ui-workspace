import Api from './api'
import { SignInResponse } from '@beckn-ui/common'

interface SignInRequest {
  email: string
  password?: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    resetLink: build.mutation<any, any>({
      query: credentials => ({
        url: '/auth/reset-link',
        method: 'POST',
        body: credentials
      })
    }),
    resetPassword: build.mutation<any, any>({
      query: credentials => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: credentials
      })
    }),
    policyLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { usePolicyLoginMutation, useResetLinkMutation, useResetPasswordMutation } = extendedAuthApi

export const {
  endpoints: { policyLogin, resetLink, resetPassword }
} = extendedAuthApi

export default extendedAuthApi
