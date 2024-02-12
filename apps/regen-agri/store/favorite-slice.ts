import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFavorite } from '../lib/types/favorite'
import { RetailItem } from '../lib/types/products'

const initialState: IFavorite = {
    items: [],
}

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addToFavorite(state, action: PayloadAction<RetailItem>) {
            state.items.push({
                ...action.payload,
            })
        },
        removeFromFavorite(state, action: PayloadAction<string>) {
            const productSlug = action.payload
            state.items = state.items.filter((item) => item.id !== productSlug)
        },
        clearCart(state) {
            state = initialState
        },
    },
})

export const favoriteActions = favoriteSlice.actions

export default favoriteSlice.reducer
