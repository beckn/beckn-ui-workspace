import Api from './api'
import { SignInResponse } from '@beckn-ui/common'

interface SignInRequest {
  email: string
  password: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    policyLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { usePolicyLoginMutation } = extendedAuthApi

export const {
  endpoints: { policyLogin }
} = extendedAuthApi

export default extendedAuthApi
