import Api from './api'
import Cookies from 'js-cookie'
import { SignInResponse } from '@beckn-ui/common'

// export interface SignInResponse {
//   mobileNumber: string
// }

export interface SignInRequest {
  mobileNumber: string
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
        url: '/unified-beckn-energy/login',
        method: 'POST',
        body: credentials
      })
    }),
    verifyOtp: build.mutation<any, { otp: number }>({
      query: ({ otp }) => ({
        url: '/unified-beckn-energy/verify-otp',
        method: 'POST',
        headers: { Authorization: 'Bearer ' + Cookies.get('authToken') },
        body: { otp }
      })
    })
  })
})

export const { useLoginMutation, useVerifyOtpMutation } = extendedAuthApi

export const {
  endpoints: { login, verifyOtp }
} = extendedAuthApi

export default extendedAuthApi
