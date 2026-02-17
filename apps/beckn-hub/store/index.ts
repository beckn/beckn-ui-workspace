/**
 * Redux store (configured in-app). No dependency on workspace packages.
 */
import { configureStore } from '@reduxjs/toolkit'
import { discoverReducer, selectReducer, initReducer, confirmReducer } from './slices'

export const store = configureStore({
  reducer: {
    discover: discoverReducer,
    select: selectReducer,
    init: initReducer,
    confirm: confirmReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
