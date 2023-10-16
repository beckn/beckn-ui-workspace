import React from 'react'
import { CartRetailItem } from './cart.types'
import CartItem from './cart-item'

export interface CartListPropsModel {
  setIsLoadingForCartCountChange: React.Dispatch<React.SetStateAction<boolean>>
  cartItems: CartRetailItem[]
  fetchCartData: () => Promise<void>
  onIncrement: (any) => void
  onDecrement: (slug: string) => void
  t: any
  locale: string
}

const CartList: React.FC<CartListPropsModel> = ({
  setIsLoadingForCartCountChange,
  cartItems,
  fetchCartData,
  onDecrement,
  onIncrement,
  t,
  locale
}) => {
  return (
    <div>
      <div className="w-full xl:max-w-[2100px] mx-auto">
        {cartItems.length !== 0
          ? cartItems.map((cartItem: CartRetailItem) => {
              return (
                <CartItem
                  setIsLoadingForCartCountChange={setIsLoadingForCartCountChange}
                  key={cartItem.id}
                  product={cartItem}
                  fetchCartData={fetchCartData}
                  onDecrement={onDecrement}
                  onIncrement={onIncrement}
                  t={t}
                  locale={locale}
                />
              )
            })
          : null}
      </div>
    </div>
  )
}

export default CartList
