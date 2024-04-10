import { retry } from '@reduxjs/toolkit/query/react'
import { api } from './api'

export interface User {
  blocked: boolean
  confirmed: boolean
  createdAt: Date
  email: string
  id: number
  provider: string
  updatedAt: Date
  username: string
}

export interface UserResponse {
  user: User
  jwt: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface SignupRequest {
  email: string
  mobile: string
  password: string
  username: string
}

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<UserResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/local',
        method: 'POST',
        body: credentials
      }),
      extraOptions: {
        backoff: () => {
          retry.fail({ fake: 'error' })
        }
      }
    }),
    register: build.mutation<UserResponse, SignupRequest>({
      query: credentials => ({
        url: '/auth/local/register',
        method: 'POST',
        body: credentials
      }),
      extraOptions: {
        backoff: () => {
          retry.fail({ fake: 'error' })
        }
      }
    })
  })
})

export const { useLoginMutation, useRegisterMutation } = authApi

export const {
  endpoints: { login, register }
} = authApi
