import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICart } from '../../lib/types/cart'
import { CartItemForRequest, ParsedItemModel } from '../../lib/types'

const initialState: ICart = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(
      state: ICart,
      action: PayloadAction<{
        product: ParsedItemModel
        quantity: number
      }>
    ) {
      const newItem = action.payload.product

      const existingItem = state.items.find(item => item.id === newItem.item.id)

      state.totalQuantity = state.totalQuantity + action.payload.quantity

      state.totalAmount =
        state.totalAmount + action.payload.quantity * parseFloat(action.payload.product.item.price.value)

      if (!existingItem) {
        const totalPrice = parseFloat(newItem.item.price.value) * action.payload.quantity

        state.items.push({
          ...newItem.item,
          quantity: action.payload.quantity,
          totalPrice,
          bpp_id: newItem.bppId,
          bpp_uri: newItem.bppUri,
          providerId: newItem.providerId,
          providerName: newItem.providerName,
          locations: newItem.providerCoordinates
        } as CartItemForRequest)
      } else {
        const totalPrice =
          parseFloat(existingItem.price.value) + parseFloat(existingItem.price.value) * action.payload.quantity

        existingItem.quantity += action.payload.quantity
        existingItem.totalPrice = totalPrice
      }
    },
    addRentalItem(
      state: ICart,
      action: PayloadAction<{
        product: ParsedItemModel
        quantity: number
      }>
    ) {
      const newItem = action.payload.product

      // Clear the cart before adding the new rental item
      state.items = []

      // Add the new item
      state.items.push({
        ...newItem.item,
        quantity: 1, // Since we are only adding one item
        totalPrice: parseFloat(newItem.item.price.value),
        bpp_id: newItem.bppId,
        bpp_uri: newItem.bppUri,
        providerId: newItem.providerId,
        providerName: newItem.providerName,
        locations: newItem.providerCoordinates
      } as CartItemForRequest)

      // Update total quantity and total amount
      state.totalQuantity = 1 // Only one item in the cart
      state.totalAmount = parseFloat(newItem.item.price.value)
    },

    removeItemFromCart(
      state: ICart,
      action: PayloadAction<string> //slug.current as payload
    ) {
      const productSlug = action.payload
      const existingItem = state.items.find(item => item.id === productSlug)

      state.totalQuantity--

      state.totalAmount = state.totalAmount - parseFloat(existingItem?.price.value!)

      if (existingItem?.quantity === 1) {
        state.items = state.items.filter(item => item.id !== productSlug)
      } else {
        existingItem!.quantity--
        existingItem!.totalPrice = existingItem!.totalPrice - parseFloat(existingItem?.price.value!)
      }
    },

    clearCart(state: ICart) {
      return { ...initialState }
    }
  }
})

export const cartActions = cartSlice.actions

export default cartSlice.reducer
