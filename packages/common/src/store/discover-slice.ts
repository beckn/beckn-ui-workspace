import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DiscoverCatalogStored } from '../../lib/types/beckn-2.0/discover'

export interface DiscoverState {
  transactionId: string
  catalogs: DiscoverCatalogStored[]
}

export interface DiscoverRootState {
  discover: DiscoverState
}

const initialState: DiscoverState = {
  transactionId: '',
  catalogs: []
}

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setTransactionId(state, action: PayloadAction<{ transactionId: string }>) {
      state.transactionId = action.payload.transactionId
    },
    setDiscoverCatalogs(state, action: PayloadAction<{ catalogs: DiscoverCatalogStored[] }>) {
      state.catalogs = action.payload.catalogs
    },
    clearDiscover(state) {
      state.transactionId = ''
      state.catalogs = []
    }
  }
})

export const discoverActions = discoverSlice.actions
export default discoverSlice.reducer
