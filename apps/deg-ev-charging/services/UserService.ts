import Api from './api'
import { SignInResponse } from '@beckn-ui/common'
import Cookies from 'js-cookie'

export interface SignInRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  address: string
  phoneNumber: string
  password: string
  utility_name?: string
}

export interface ProfileUser {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface ProfileResponse {
  id: number
  documentId?: string
  name: string
  phone: string
  address: string | null
  zip_code: string | null
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  locale?: string | null
}

export interface GetProfileResponse {
  user: ProfileUser
  profile: ProfileResponse
}

export interface UpdateProfileRequest {
  name?: string
  address?: string
  phone?: string
  zip_code?: string
}

const extendedAuthApi = Api.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<GetProfileResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET'
      }),
      providesTags: ['Auth']
    }),
    updateProfile: build.mutation<GetProfileResponse, UpdateProfileRequest>({
      query: body => ({
        url: '/profile',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Auth']
    }),
    tradeLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: {
          identifier: credentials.email,
          password: credentials.password
        }
      })
    }),
    tradeRegister: build.mutation<SignInResponse, RegisterRequest>({
      query: credentials => ({
        url: '/register',
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

export const {
  useTradeLoginMutation,
  useTradeRegisterMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useUpdateProfileMutation
} = extendedAuthApi

export const {
  endpoints: { tradeLogin, tradeRegister, getProfile, updateProfile }
} = extendedAuthApi

export default extendedAuthApi
