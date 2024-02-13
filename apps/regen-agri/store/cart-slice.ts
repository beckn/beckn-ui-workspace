import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICart } from '../lib/types/cart'
import { RetailItem } from '../lib/types/products'
import { calculateDiscountPercentage } from '../utilities/calculateDiscountPercentage'

const initialState: ICart = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    currency: 'EUR',
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart(
            state: ICart,
            action: PayloadAction<{ product: RetailItem; quantity: number }>
        ) {
            const newItem = action.payload.product

            const existingItem = state.items.find(
                (item) => item.id === newItem.id
            )

            state.totalQuantity = state.totalQuantity + action.payload.quantity
            state.currency = action.payload.product.price.currency

            state.totalAmount =
                state.totalAmount +
                action.payload.quantity *
                    parseFloat(action.payload.product.price.value)

            if (!existingItem) {
                const totalPrice =
                    parseFloat(newItem.price.value) * action.payload.quantity

                state.items.push({
                    ...newItem,
                    quantity: action.payload.quantity,
                    totalPrice,
                })
            } else {
                const totalPrice =
                    parseFloat(existingItem.price.value) +
                    parseFloat(existingItem.price.value) *
                        action.payload.quantity

                existingItem.quantity += action.payload.quantity
                existingItem.totalPrice = totalPrice
            }
        },

        removeItemFromCart(
            state: ICart,
            action: PayloadAction<string> //slug.current as payload
        ) {
            const productSlug = action.payload
            const existingItem = state.items.find(
                (item) => item.id === productSlug
            )

            state.totalQuantity--

            state.totalAmount =
                state.totalAmount - parseFloat(existingItem?.price.value!)

            if (existingItem?.quantity === 1) {
                state.items = state.items.filter(
                    (item) => item.id !== productSlug
                )
            } else {
                existingItem!.quantity--
                existingItem!.totalPrice =
                    existingItem!.totalPrice -
                    parseFloat(existingItem?.price.value!)
            }
        },

        clearCart(state: ICart) {
            return { ...initialState }
        },
    },
})

export const cartActions = cartSlice.actions

export default cartSlice.reducer
