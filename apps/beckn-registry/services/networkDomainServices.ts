import api from './api'

export interface NetworkDomain {
  name: string
  description: string
  schema_url: string
  updater_user?: string
  creator_user?: string
  updatedAt?: string
  createdAt?: string
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
    getNetworkDomains: builder.query<NetworkDomainResponse, { page: number; pageSize: number; searchQuery?: string }>({
      query: ({ page, pageSize, searchQuery }) => {
        const params: Record<string, string | number> = {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize
        }

        if (searchQuery) {
          params['filters[$or][0][name][$contains]'] = searchQuery
          params['filters[$or][1][description][$contains]'] = searchQuery
          params['filters[$or][2][schema_url][$contains]'] = searchQuery
        }

        return {
          url: '/network-domains',
          params
        }
      }
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
