import { retry } from '@reduxjs/toolkit/query/react'
import { api } from './becknApi'

export const initApi = api.injectEndpoints({
  endpoints: build => ({
    init: build.mutation<any, any>({
      query: credentials => ({
        url: '/init',
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

export const { useInitMutation } = initApi

export const {
  endpoints: { init }
} = initApi
