import { retry } from '@reduxjs/toolkit/query/react'
import Api from './becknApi'

const confirmApi = Api.injectEndpoints({
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

export default confirmApi
