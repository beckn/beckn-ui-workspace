import { createSlice } from '@reduxjs/toolkit'
import { NetworkParticipant, networkParticipantsApi } from '@services/networkParticipantServices'

interface NetworkParticipantsState {
  participants: NetworkParticipant[]
  loading: boolean
  error: string | null
  deleteLoading: boolean
  deleteError: string | null
  updateLoading: boolean
  updateError: string | null
}

const initialState: NetworkParticipantsState = {
  participants: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
  updateLoading: false,
  updateError: null
}

const networkParticipantsSlice = createSlice({
  name: 'networkParticipants',
  initialState,
  reducers: {
    clearParticipants: state => {
      state.participants = []
      state.error = null
    },
    clearDeleteError: state => {
      state.deleteError = null
    },
    clearUpdateError: state => {
      state.updateError = null
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
        state.participants = action.payload
      })
      .addMatcher(networkParticipantsApi.endpoints.getNetworkParticipants.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch network participants'
      })
      // Delete Network Participant
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchPending, state => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchFulfilled, state => {
        state.deleteLoading = false
      })
      .addMatcher(networkParticipantsApi.endpoints.deleteNetworkParticipant.matchRejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.error.message || 'Failed to delete network participant'
      })
      // Update Network Participant
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchPending, state => {
        state.updateLoading = true
        state.updateError = null
      })
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchFulfilled, state => {
        state.updateLoading = false
      })
      .addMatcher(networkParticipantsApi.endpoints.updateNetworkParticipant.matchRejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.error.message || 'Failed to update network participant'
      })
  }
})

export const { clearParticipants, clearDeleteError, clearUpdateError } = networkParticipantsSlice.actions
export default networkParticipantsSlice.reducer
