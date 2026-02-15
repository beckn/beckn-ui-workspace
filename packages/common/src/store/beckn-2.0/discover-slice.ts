import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DiscoverCatalogStored } from '../../lib/types/beckn-2.0/discover'

/**
 * Beckn 2.0 Discover state (transaction_id + catalogs from discover API).
 * Generic: any app using Beckn 2.0 discover can use this slice.
 */
export interface DiscoverBeckn20State {
  transactionId: string
  catalogs: DiscoverCatalogStored[]
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
