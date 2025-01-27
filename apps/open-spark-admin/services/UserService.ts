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
    bapTradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/beckn-trade-bap/login',
        method: 'POST',
        body: credentials
      })
    }),
    bppTradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/beckn-trade-bpp/login',
        method: 'POST',
        body: credentials
      })
    }),
    bapTradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/beckn-trade-bap/signup',
        method: 'POST',
        body: credentials
      })
    }),
    bppTradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/beckn-trade-bpp/signup',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const {
  useBapTradeLoginMutation,
  useBppTradeLoginMutation,
  useBapTradeRegisterMutation,
  useBppTradeRegisterMutation
} = extendedAuthApi

export const {
  endpoints: { bapTradeLogin, bppTradeLogin, bapTradeRegister, bppTradeRegister }
} = extendedAuthApi

export default extendedAuthApi
