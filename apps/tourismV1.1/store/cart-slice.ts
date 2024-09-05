import { ICart, ParsedItemModel } from '@beckn-ui/common'
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

      const existingItem = state.items.find(item => item.id === newItem.item.id)

      state.totalQuantity = action.payload.quantity

      state.totalAmount = action.payload.quantity * parseFloat(action.payload.product.item.price.value)

      state.items.pop()

      if (!existingItem) {
        const totalPrice = parseFloat(newItem.item.price.value) * action.payload.quantity
        state.items.push({
          ...newItem.item,
          quantity: action.payload.quantity,
          totalPrice,
          bpp_id: newItem.bppId,
          bpp_uri: newItem.bppUri,
          providerId: newItem.providerId,
          locations: newItem.providerCoordinates
        })
      } else {
        const totalPrice =
          parseFloat(existingItem.price.value) + parseFloat(existingItem.price.value) * action.payload.quantity

        existingItem.quantity += action.payload.quantity
        existingItem.totalPrice = totalPrice
      }
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
