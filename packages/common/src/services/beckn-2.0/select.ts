import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'

const becknSelectApi = Api.injectEndpoints({
  endpoints: build => ({
    becknSelect: build.mutation<any, any>({
      query: payload => ({
        url: '/select',
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

export const { useBecknSelectMutation } = becknSelectApi

export const {
  endpoints: { becknSelect }
} = becknSelectApi

export default becknSelectApi
