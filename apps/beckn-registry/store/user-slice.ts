import { createSlice } from '@reduxjs/toolkit'
import { User } from '@lib/types/auth'
import { userApi } from '@services/userServices'

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: state => {
      state.currentUser = null
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.getCurrentUser.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(userApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addMatcher(userApi.endpoints.getCurrentUser.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user data'
      })
      .addMatcher(userApi.endpoints.updateCurrentUser.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(userApi.endpoints.updateCurrentUser.matchFulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addMatcher(userApi.endpoints.updateCurrentUser.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update user data'
      })
  }
})

export const { clearUser } = userSlice.actions
export default userSlice.reducer
