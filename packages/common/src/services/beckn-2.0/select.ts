import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'
import type { SelectRequest, SelectResponse } from '@beckn-ui/common/lib/types/beckn-2.0/select'

const selectApi = Api.injectEndpoints({
  overrideExisting: true,
  endpoints: build => ({
    select: build.mutation<SelectResponse, SelectRequest>({
      query: (payload: SelectRequest) => ({
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

export const { useSelectMutation } = selectApi

export const {
  endpoints: { select }
} = selectApi

export default selectApi
