import React from 'react'

//Custom
import { CartListProps, CartItemProps } from './cart.types'
import CartItem from './cart-item'
import Styles from './cart-list.module.css'

const CartList: React.FC<CartListProps> = ({ cartItems }) => {
  return (
    <div style={{ width: '100%' }}>
      <div className={Styles.cart_list_container}>
        {cartItems.length !== 0
          ? cartItems.map((cartItem: CartItemProps) => {
              return (
                <CartItem
                  key={cartItem.id}
                  className={'cart-item'}
                  {...cartItem}
                />
              )
            })
          : null}
      </div>
    </div>
  )
}

export default CartList
