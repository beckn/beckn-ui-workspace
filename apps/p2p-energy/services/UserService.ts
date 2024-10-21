import Api from './api'
import { SignInResponse } from '@beckn-ui/common'

interface SignInRequest {
  email: string
  password: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    consumerLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/driver-app/login',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useConsumerLoginMutation } = extendedAuthApi

export const {
  endpoints: { consumerLogin }
} = extendedAuthApi

export default extendedAuthApi
