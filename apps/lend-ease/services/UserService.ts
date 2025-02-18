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
    tradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/beckn-energy-finance/login',
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
    })
  })
})

export const { useTradeLoginMutation, useTradeRegisterMutation } = extendedAuthApi

export const {
  endpoints: { tradeLogin, tradeRegister }
} = extendedAuthApi

export default extendedAuthApi
