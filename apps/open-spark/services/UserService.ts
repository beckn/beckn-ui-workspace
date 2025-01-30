import Api from './api'
import { SignInResponse, SignUpRequest } from '@beckn-ui/common'
import Cookies from 'js-cookie'

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
    tradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/unified-beckn-energy/login',
        method: 'POST',
        body: credentials
      })
    }),
    tradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/unified-beckn-energy/signup',
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

export const { useTradeLoginMutation, useTradeRegisterMutation, useVerifyOtpMutation } = extendedAuthApi

export const {
  endpoints: { tradeLogin, tradeRegister }
} = extendedAuthApi

export default extendedAuthApi
