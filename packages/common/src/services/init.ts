import { retry } from '@reduxjs/toolkit/query/react'
import Api from './becknApi'

const initApi = Api.injectEndpoints({
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

export default initApi
