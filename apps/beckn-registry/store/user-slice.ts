import { createSlice } from '@reduxjs/toolkit'
import { User } from '@lib/types/auth'
import { userApi } from '@services/userServices'

interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: state => {
      state.currentUser = null
      state.error = null
    },
    setUsers: (state, action) => {
      state.users = action.payload
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
      .addMatcher(userApi.endpoints.getUsers.matchPending, state => {
        state.loading = true
        state.error = null
      })
      .addMatcher(userApi.endpoints.getUsers.matchFulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.results
        state.pagination = {
          page: Number(action.payload.pagination.page),
          pageSize: Number(action.payload.pagination.pageSize),
          total: Number(action.payload.pagination.total)
        }
      })
      .addMatcher(userApi.endpoints.getUsers.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  }
})

export const { clearUser, setUsers, setPagination, setLoading, setError } = userSlice.actions
export default userSlice.reducer
