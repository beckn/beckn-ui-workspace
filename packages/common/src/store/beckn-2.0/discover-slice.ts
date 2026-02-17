import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DiscoverCatalogStored } from '../../../lib/types/beckn-2.0/discover'

/**
 * Beckn 2.0 Discover state (transaction_id, catalogs, and last response context for select/init/confirm chain).
 */
export interface DiscoverBeckn20State {
  transactionId: string
  catalogs: DiscoverCatalogStored[]
  /** Last discover API response context; use as previous context when building select request */
  lastResponseContext: Record<string, unknown> | null
}

export interface DiscoverBeckn20RootState {
  discover: DiscoverBeckn20State
}

/** @deprecated Use DiscoverBeckn20State. Kept for backward compatibility. */
export type DiscoverState = DiscoverBeckn20State
/** @deprecated Use DiscoverBeckn20RootState. Kept for backward compatibility. */
export type DiscoverRootState = DiscoverBeckn20RootState

const initialState: DiscoverBeckn20State = {
  transactionId: '',
  catalogs: [],
  lastResponseContext: null
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
    setDiscoverResponseContext(state, action: PayloadAction<{ context: Record<string, unknown> }>) {
      state.lastResponseContext = action.payload.context
    },
    clearDiscover(state) {
      state.transactionId = ''
      state.catalogs = []
      state.lastResponseContext = null
    }
  }
})

export const discoverActions = discoverSlice.actions
export default discoverSlice.reducer
