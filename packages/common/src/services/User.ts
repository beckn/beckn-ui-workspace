import { SignInRequest, SignUpRequest, SignInResponse } from '../../lib/types'
import Api from './api'

const authApi = Api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/auth/local',
        method: 'POST',
        body: credentials
      })
    }),
    register: build.mutation<SignInResponse, SignUpRequest>({
      query: credentials => ({
        url: '/auth/local/register',
        method: 'POST',
        body: credentials
      })
      // extraOptions: {
      //   backoff: () => {
      //     retry.fail({ fake: 'error' })
      //   }
      // }
    })
  })
})

export const { useLoginMutation, useRegisterMutation } = authApi

export const {
  endpoints: { login, register }
} = authApi

export default authApi
