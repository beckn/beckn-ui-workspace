import { Item, ParsedItemModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ChargerPort {
  id: string
  type: string
  icon: string
}

export interface SelectedCharger {
  id: string
  name: string
  address: string
  status: string
  rate: number
  ports: ChargerPort[]
  selectedPort?: ChargerPort
  selectedVehicleType?: string
  data?: { providerDetails: ParsedItemModel; itemDetails: Item }
}

export interface ChargerSelectState {
  selectedCharger: SelectedCharger | null
  apiResponse: Record<string, unknown> | null
}

export interface ChargerSelectRootState {
  selectCharger: ChargerSelectState
}

const initialState: ChargerSelectState = {
  selectedCharger: null,
  apiResponse: null
}

const chargerSelectSlice = createSlice({
  name: 'selectCharger',
  initialState,
  reducers: {
    setSelectedCharger: (state, action: PayloadAction<SelectedCharger>) => {
      state.selectedCharger = action.payload
    },
    setApiResponse: (state, action: PayloadAction<{ data?: Record<string, unknown> } | Record<string, unknown>>) => {
      const response = 'data' in action.payload ? action.payload.data : action.payload
      state.apiResponse = response as Record<string, unknown> | null
    },
    resetChargerSelection: () => initialState
  }
})

export const { setSelectedCharger, setApiResponse, resetChargerSelection } = chargerSelectSlice.actions
export const chargerSelectActions = chargerSelectSlice.actions
export default chargerSelectSlice.reducer
