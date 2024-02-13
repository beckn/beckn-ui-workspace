import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IProductList } from '../lib/types/productList'
import { RetailItem } from '../lib/types/products'
import { sortByCheapest, sortByExpensive } from '../utilities/sortByCost'

const initialState: IProductList = {
    productsList: [],
}

const SortedProductsListSlice = createSlice({
    name: 'sortedProductsList',
    initialState,
    reducers: {
        sortProductsList(
            state,
            action: PayloadAction<{
                productsList: RetailItem[]
                sortBasedOn: string
            }>
        ) {
            switch (action.payload.sortBasedOn) {
                case 'all':
                    state.productsList = action.payload.productsList
                    break
                case 'cheapest': {
                    state.productsList = state.productsList.sort(sortByCheapest)
                    break
                }
                case 'expensive': {
                    state.productsList =
                        state.productsList.sort(sortByExpensive)
                    break
                }
            }
        },
    },
})
export const SortedProductsListActions = SortedProductsListSlice.actions

export default SortedProductsListSlice.reducer
