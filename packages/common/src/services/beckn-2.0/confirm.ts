import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'
import type { ConfirmRequest, ConfirmResponse } from '@beckn-ui/common/lib/types/beckn-2.0/confirm'

const confirmApi = Api.injectEndpoints({
  endpoints: build => ({
    confirm: build.mutation<ConfirmResponse, ConfirmRequest>({
      query: (payload: ConfirmRequest) => ({
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

export const { useConfirmMutation } = confirmApi

export const {
  endpoints: { confirm }
} = confirmApi

export default confirmApi
