import { retry } from '@reduxjs/toolkit/query/react'
import Api from '../becknApi'
import type { DiscoverRequest, DiscoverResponse } from '@beckn-ui/common/lib/types/beckn-2.0/discover'

const discoverApi = Api.injectEndpoints({
  endpoints: build => ({
    discover: build.mutation<DiscoverResponse, DiscoverRequest>({
      query: (payload: DiscoverRequest) => ({
        url: '/discover',
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

export const { useDiscoverMutation } = discoverApi

export const {
  endpoints: { discover }
} = discoverApi

export default discoverApi
