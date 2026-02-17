/**
 * Discover state slice. Stores context, catalogs, last response context.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface DiscoverState {
  transactionId: string
  catalogs: unknown[]
  lastResponseContext: Record<string, unknown> | null
  isLoading: boolean
  error: string | null
}

const initialState: DiscoverState = {
  transactionId: '',
  catalogs: [],
  lastResponseContext: null,
  isLoading: false,
  error: null
}

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setTransactionId(state, action: PayloadAction<string>) {
      state.transactionId = action.payload
    },
    setCatalogs(state, action: PayloadAction<unknown[]>) {
      state.catalogs = action.payload
      state.error = null
    },
    setLastResponseContext(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.lastResponseContext = action.payload
    },
    setDiscoverLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setDiscoverError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearDiscover(state) {
      state.catalogs = []
      state.lastResponseContext = null
      state.error = null
    }
  }
})

export const discoverActions = discoverSlice.actions
export default discoverSlice.reducer
