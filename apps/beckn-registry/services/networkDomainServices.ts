import api from './api'

export interface NetworkDomain {
  name: string
  description: string
  schema_url: string
  updater_user?: string
  creator_user?: string
  updated_at?: string
  created_at?: string
}

export interface NetworkDomainResponse {
  results: NetworkDomain[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export const networkDomainApi = api.injectEndpoints({
  endpoints: builder => ({
    getNetworkDomains: builder.query<NetworkDomainResponse, { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => ({
        url: '/network-domains',
        params: {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize
        }
      })
    }),
    getNetworkDomainById: builder.query<NetworkDomain, string>({
      query: documentId => `/network-domains/${documentId}`
    }),
    createNetworkDomain: builder.mutation<{ data: NetworkDomain }, NetworkDomain>({
      query: networkDomain => ({
        url: '/network-domains',
        method: 'POST',
        body: networkDomain
      })
    }),
    updateNetworkDomain: builder.mutation<
      { data: NetworkDomain },
      { documentId: string; networkDomain: Partial<NetworkDomain> }
    >({
      query: ({ documentId, networkDomain }) => ({
        url: `/network-domains/${documentId}`,
        method: 'PUT',
        body: networkDomain
      })
    }),
    deleteNetworkDomain: builder.mutation<void, string>({
      query: documentId => ({
        url: `/network-domains/${documentId}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetNetworkDomainsQuery,
  useGetNetworkDomainByIdQuery,
  useCreateNetworkDomainMutation,
  useUpdateNetworkDomainMutation,
  useDeleteNetworkDomainMutation
} = networkDomainApi
