import { createSlice } from '@reduxjs/toolkit'
import { NetworkParticipant, networkParticipantsApi } from '@services/networkParticipantServices'

interface NetworkParticipantsState {
  participants: NetworkParticipant[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

const initialState: NetworkParticipantsState = {
  participants: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

const networkParticipantSlice = createSlice({
  name: 'networkParticipant',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    setParticipants: (state, action) => {
      state.participants = action.payload
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
      // Get Network Participants
      .addMatcher(networkParticipantsApi.endpoints.getNetworkParticipants.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkParticipantsApi.endpoints.getNetworkParticipants.matchFulfilled, (state, action) => {
        state.loading = false
        state.participants = action.payload.results
        // state.pagination = {
        //   page: action.payload.pagination.page,
        //   pageSize: action.payload.pagination.pageSize,
        //   total: action.payload.pagination.total
        // }
      })
      .addMatcher(networkParticipantsApi.endpoints.getNetworkParticipants.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch network participants'
      })
      // Delete Network Participant
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete network participant'
      })
      // Update Network Participant
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update network participant'
      })
      // Create Network Participant
      .addMatcher(networkParticipantsApi.endpoints.addNetworkParticipant.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(networkParticipantsApi.endpoints.addNetworkParticipant.matchFulfilled, state => {
        state.loading = false
      })
      .addMatcher(networkParticipantsApi.endpoints.addNetworkParticipant.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add network participant'
      })
  }
})

export const { clearError, setParticipants, setPagination, setLoading, setError } = networkParticipantSlice.actions
export default networkParticipantSlice.reducer
