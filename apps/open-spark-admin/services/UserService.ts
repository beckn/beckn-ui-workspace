import Api from './api'
import { SignInResponse, SignUpRequest } from '@beckn-ui/common'

export interface SignInRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullname: string
  email: string
  address: string
  phone_no: string
  password: string
  utility_name: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/beckn-energy-admin/login',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useLoginMutation } = extendedAuthApi

export const {
  endpoints: { login }
} = extendedAuthApi

export default extendedAuthApi
