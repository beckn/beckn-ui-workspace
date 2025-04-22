import { createSlice } from '@reduxjs/toolkit'
import { NetworkDomain, networkDomainApi } from '@services/networkDomainServices'

interface NetworkDomainState {
  domains: NetworkDomain[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

const initialState: NetworkDomainState = {
  domains: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

const networkDomainSlice = createSlice({
  name: 'networkDomains',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    setDomains: (state, action) => {
      state.domains = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: builder => {
    builder
      // Get Network Domains
      .addMatcher(networkDomainApi.endpoints.getNetworkDomains.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkDomainApi.endpoints.getNetworkDomains.matchFulfilled, (state, action) => {
        state.loading = false
        state.domains = action.payload.results
        state.pagination = action.payload.pagination
      })
      .addMatcher(networkDomainApi.endpoints.getNetworkDomains.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch network domains'
      })
      // Delete Network Domain
      .addMatcher(networkDomainApi.endpoints.deleteNetworkDomain.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkDomainApi.endpoints.deleteNetworkDomain.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkDomainApi.endpoints.deleteNetworkDomain.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete network domain'
      })
      // Create Network Domain
      .addMatcher(networkDomainApi.endpoints.createNetworkDomain.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkDomainApi.endpoints.createNetworkDomain.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkDomainApi.endpoints.createNetworkDomain.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add network domain'
      })
      // Update Network Domain
      .addMatcher(networkDomainApi.endpoints.updateNetworkDomain.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkDomainApi.endpoints.updateNetworkDomain.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkDomainApi.endpoints.updateNetworkDomain.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update network domain'
      })
  }
})

export const { clearError, setDomains, setPagination, setLoading, setError } = networkDomainSlice.actions
export default networkDomainSlice.reducer
