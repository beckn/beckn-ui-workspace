import Api from './api'
import { SignInResponse, SignUpRequest } from '@beckn-ui/common'

export interface SignInRequest {
  email: string
  password: string
}

export interface RegisterRequest extends SignUpRequest {
  utilityCompany: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    bapTradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/bap/login',
        method: 'POST',
        body: credentials
      })
    }),
    bppTradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/bpp/login',
        method: 'POST',
        body: credentials
      })
    }),
    bapTradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/bap/register',
        method: 'POST',
        body: credentials
      })
    }),
    bppTradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/bpp/register',
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
