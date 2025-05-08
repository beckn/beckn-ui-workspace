import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ParsedItemModel } from '@beckn-ui/common'

export interface SearchTermModel {
  searchKeyword: string
  category?: string
}
interface SearchState {
  searchTerm: string | SearchTermModel
  items: ParsedItemModel[]
  originalItems: ParsedItemModel[]
}

const initialState: SearchState = {
  searchTerm: '',
  items: [],
  originalItems: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string | SearchTermModel>) {
      state.searchTerm = action.payload
    },
    setItems(state, action: PayloadAction<ParsedItemModel[]>) {
      state.items = action.payload
    },
    setOriginalItems(state, action: PayloadAction<ParsedItemModel[]>) {
      state.originalItems = action.payload
    },
    resetSearch(state) {
      state.searchTerm = ''
      state.items = []
      state.originalItems = []
    }
  }
})

export const { setSearchTerm, setItems, setOriginalItems, resetSearch } = searchSlice.actions
export default searchSlice.reducer
