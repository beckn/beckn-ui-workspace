import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'

const statusApi = Api.injectEndpoints({
  endpoints: build => ({
    status: build.query<any, any>({
      query: params => ({
        url: '/status',
        method: 'GET',
        params
      }),
      extraOptions: {
        backoff: () => {
          retry.fail({ fake: 'error' })
        }
      }
    })
  })
})

export const { useStatusQuery } = statusApi

export const {
  endpoints: { status }
} = statusApi

export default statusApi
