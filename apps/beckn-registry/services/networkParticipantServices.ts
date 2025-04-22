import api from './api'

export interface NetworkParticipant {
  subscriber_id: string
  type: string
  domain: string
  city: string
  country: string
  signing_public_key: string
  encryption_public_key: string
  status: string
  created: string
  updated: string
}

export interface UpdateNetworkParticipantPayload {
  data: {
    signing_public_key: string
    encr_public_key: string
    subscriber_url: string
    valid_from: string
    valid_until: string
  }
}

export const networkParticipantsApi = api.injectEndpoints({
  endpoints: build => ({
    getNetworkParticipants: build.query<NetworkParticipant[], void>({
      query: () => ({
        url: '/subscribers',
        method: 'GET'
      }),
      providesTags: ['NetworkParticipants']
    }),
    deleteNetworkParticipant: build.mutation<void, string>({
      query: subscriberId => ({
        url: `/subscribers/${subscriberId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['NetworkParticipants']
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
      invalidatesTags: ['NetworkParticipants']
    })
  })
})

export const {
  useGetNetworkParticipantsQuery,
  useDeleteNetworkParticipantMutation,
  useUpdateNetworkParticipantMutation
} = networkParticipantsApi
