import api from './api'

export interface NetworkParticipant {
  subscriber_id: string
  subscriber_url: string
  unique_key_id: string
  type: string
  domain: string
  name: string
  city: string
  country: string
  signing_public_key: string
  encr_public_key: string
  valid_from: string
  valid_until: string
  status: string
  created: string
  updated: string
}

export interface AddNetworkParticipantPayload {
  subscriber_id: string
  url: string
  key_id: string
  type: string
  domain: string
  signing_public_key: string
  encr_public_key: string
  valid_from: string
  valid_until: string
  status: string
}

export interface UpdateNetworkParticipantPayload {
  subscriber_id: string
  url: string
  key_id: string
  type: string
  domain: string
  signing_public_key: string
  encr_public_key: string
  valid_from: string
  valid_until: string
  status: string
}

export interface NetworkParticipantResponse {
  results: NetworkParticipant[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const networkParticipantsApi = api.injectEndpoints({
  endpoints: build => ({
    getNetworkParticipants: build.query<
      NetworkParticipantResponse,
      { page: number; pageSize: number; searchQuery?: string }
    >({
      query: ({ page, pageSize, searchQuery }) => {
        const params: Record<string, string | number> = {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize
        }

        if (searchQuery) {
          params['name'] = searchQuery || ''
        }

        return {
          url: '/subscribers',
          params
        }
      },
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ subscriber_id }) => ({
                type: 'NetworkParticipants' as const,
                id: subscriber_id
              })),
              { type: 'NetworkParticipants' as const, id: 'LIST' }
            ]
          : [{ type: 'NetworkParticipants' as const, id: 'LIST' }]
    }),
    deleteNetworkParticipant: build.mutation<void, string>({
      query: subscriberId => ({
        url: `/subscribers/${subscriberId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, subscriberId) => [
        { type: 'NetworkParticipants' as const, id: subscriberId },
        { type: 'NetworkParticipants' as const, id: 'LIST' }
      ]
    }),
    addNetworkParticipant: build.mutation<NetworkParticipant, AddNetworkParticipantPayload>({
      query: data => ({
        url: '/subscribers/subscribe',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'NetworkParticipants' as const, id: 'LIST' }]
    }),
    updateNetworkParticipant: build.mutation<
      NetworkParticipant,
      { subscriberId: string; data: UpdateNetworkParticipantPayload }
    >({
      query: ({ subscriberId, data }) => ({
        url: `/subscribers/${subscriberId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { subscriberId }) => [
        { type: 'NetworkParticipants' as const, id: subscriberId },
        { type: 'NetworkParticipants' as const, id: 'LIST' }
      ]
    }),
    getNetworkParticipantById: build.query<NetworkParticipant, string>({
      query: subscriberId => ({
        url: `/subscribers/${subscriberId}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'NetworkParticipants' as const, id }]
    })
  })
})

export const {
  useGetNetworkParticipantsQuery,
  useDeleteNetworkParticipantMutation,
  useAddNetworkParticipantMutation,
  useUpdateNetworkParticipantMutation,
  useGetNetworkParticipantByIdQuery
} = networkParticipantsApi
