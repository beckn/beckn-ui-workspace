import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface LastDiscoverCoords {
  lat: number
  lng: number
}

interface SearchByLocationState {
  /** Coords used for the last successful discover; used to restore map when user navigates back from detail view */
  lastDiscoverCoords: LastDiscoverCoords | null
}

const initialState: SearchByLocationState = {
  lastDiscoverCoords: null
}

const slice = createSlice({
  name: 'searchByLocation',
  initialState,
  reducers: {
    setLastDiscoverCoords(state, action: PayloadAction<LastDiscoverCoords>) {
      state.lastDiscoverCoords = action.payload
    },
    clearLastDiscoverCoords(state) {
      state.lastDiscoverCoords = null
    }
  }
})

export const searchByLocationActions = slice.actions
export default slice.reducer
