import React from 'react'
import cl from 'classnames'
import { Box } from '@chakra-ui/react'

// Custom
import { CartProps } from './cart.types'
import CartList from './cart-list'
import Styles from './cart.module.css'
import { Loader } from '@beckn-ui/molecules'
import OrderSummaryBox from './order-summary-box'

const Cart: React.FC<CartProps> = ({
  schema: { loader, cartItems, orderSummary },
  isLoading = false,
  emptyText = 'Empty cart',
  className
}) => {
  if (isLoading) {
    return <Loader {...loader} />
  }

  if (cartItems.length == 0) {
    return (
      <>
        <p className={Styles.empty_cart_text}>{emptyText}</p>
      </>
    )
  }

  return (
    <Box className={cl(`${className}`, Styles.cart_list_comp_container)}>
      <CartList cartItems={cartItems} />
      <OrderSummaryBox {...orderSummary} />
    </Box>
  )
}

export default Cart
