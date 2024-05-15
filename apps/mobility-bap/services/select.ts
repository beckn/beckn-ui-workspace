import { retry } from '@reduxjs/toolkit/query/react'
import { api } from './becknApi'

export const selectApi = api.injectEndpoints({
  endpoints: build => ({
    select: build.mutation<any, any>({
      query: credentials => ({
        url: '/select',
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

export const { useSelectMutation } = selectApi

export const {
  endpoints: { select }
} = selectApi
