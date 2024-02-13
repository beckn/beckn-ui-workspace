import React from 'react'
import { useSelector } from 'react-redux'
import { ICartRootState } from '../../lib/types/cart'
import { RetailItem } from '../../lib/types/products'
import CartItem from './CartItem'

interface CartListPropsModel {
    setIsLoadingForCartCountChange: Function
}

const CartList: React.FC<CartListPropsModel> = ({
    setIsLoadingForCartCountChange,
}) => {
    const cartItems = useSelector((state: ICartRootState) => state.cart.items)

    return (
        <div>
            <div className="w-full xl:max-w-[2100px] mx-auto">
                {cartItems.length !== 0
                    ? cartItems.map((cartItem: RetailItem) => {
                          return (
                              <CartItem
                                  setIsLoadingForCartCountChange={
                                      setIsLoadingForCartCountChange
                                  }
                                  key={cartItem.id}
                                  product={cartItem}
                              />
                          )
                      })
                    : null}
            </div>
        </div>
    )
}

export default CartList
