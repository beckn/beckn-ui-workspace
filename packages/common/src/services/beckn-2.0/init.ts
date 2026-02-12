import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'
import type { InitRequest, InitResponse } from '@beckn-ui/common/lib/types/beckn-2.0/init'

const initApi = Api.injectEndpoints({
  endpoints: build => ({
    init: build.mutation<InitResponse, InitRequest>({
      query: (payload: InitRequest) => ({
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

export const { useInitMutation } = initApi

export const {
  endpoints: { init }
} = initApi

export default initApi
