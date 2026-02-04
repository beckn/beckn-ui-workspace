import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'

const becknInitApi = Api.injectEndpoints({
  endpoints: build => ({
    becknInit: build.mutation<any, any>({
      query: payload => ({
        url: '/init',
        method: 'POST',
        body: payload
      }),
      extraOptions: {
        backoff: () => {
          retry.fail({ fake: 'error' })
        }
      }
    })
  })
})

export const { useBecknInitMutation } = becknInitApi

export const {
  endpoints: { becknInit }
} = becknInitApi

export default becknInitApi
