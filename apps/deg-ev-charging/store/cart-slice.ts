import { CartItemForRequest, ICart, ParsedItemModel } from '@beckn-ui/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
      const quantity = Number(action.payload.quantity) // Ensure quantity is a number
      const price = Number(newItem.item.price.value) // Ensure price is a number

      const existingItem = state.items.find(item => item.id === newItem.item.id)

      state.totalQuantity = quantity

      state.totalAmount = Number((quantity * price).toFixed(2))

      if (!existingItem) {
        const totalPrice = Number((price * quantity).toFixed(2))

        state.items.push({
          ...newItem.item,
          quantity: quantity,
          totalPrice,
          bpp_id: newItem.bppId,
          bpp_uri: newItem.bppUri,
          providerId: newItem.providerId,
          providerName: newItem.providerName,
          locations: newItem.providerCoordinates
        } as CartItemForRequest)
      } else {
        const totalPrice = Number((parseFloat(existingItem.price.value) * quantity).toFixed(2))

        existingItem.quantity = quantity
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
