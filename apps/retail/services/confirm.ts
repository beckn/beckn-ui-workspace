import { retry } from '@reduxjs/toolkit/query/react'
import { api } from './becknApi'

export const confirmApi = api.injectEndpoints({
  endpoints: build => ({
    confirm: build.mutation<any, any>({
      query: credentials => ({
        url: '/confirm',
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

export const { useConfirmMutation } = confirmApi

export const {
  endpoints: { confirm }
} = confirmApi
