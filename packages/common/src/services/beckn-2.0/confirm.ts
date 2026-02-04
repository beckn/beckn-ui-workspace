import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'

const becknConfirmApi = Api.injectEndpoints({
  endpoints: build => ({
    becknConfirm: build.mutation<any, any>({
      query: payload => ({
        url: '/confirm',
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

export const { useBecknConfirmMutation } = becknConfirmApi

export const {
  endpoints: { becknConfirm }
} = becknConfirmApi

export default becknConfirmApi
