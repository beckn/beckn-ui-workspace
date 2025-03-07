import Api from './api'
import { SignInResponse, SignUpRequest } from '@beckn-ui/common'

export interface SignInRequest {
  phone: string
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
        url: '/unified-beckn-energy/mobile-login',
        method: 'POST',
        body: credentials
      })
    }),
    tradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/beckn-energy-finance/signup',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useTradeLoginMutation, useTradeRegisterMutation } = extendedAuthApi

export const {
  endpoints: { tradeLogin, tradeRegister }
} = extendedAuthApi

export default extendedAuthApi
