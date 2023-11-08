// Native
import React from 'react'
import { useEffect, useState } from 'react'

// Installed
import cl from 'classnames'
import { Box } from '@chakra-ui/react'

// Custom
import { CartRetailItem } from './cart.types'
import { Loader } from '@beckn-ui/molecules'
import CartList from './cart-list'
import Styles from './cart.module.css'
// import OrderSummaryBox from './order-summary-box'

const emptyCardText = 'Empty cart'

interface CartProps {
  classNames?: string
  loadingText: string
  cartItems: CartRetailItem[]
  fetchCartData: () => Promise<void>
  loading: boolean
  fetchOnLoad: boolean
  handleOrderClick: () => void
  isEmptyCart: boolean
  onIncrement: (any) => void
  onDecrement: (slug: string) => void
  t: any
  locale: string
}

const Cart: React.FC<CartProps> = ({
  loading,
  loadingText,
  cartItems,
  classNames,
  fetchCartData,
  fetchOnLoad,
  handleOrderClick,
  isEmptyCart,
  onIncrement,
  onDecrement,
  t,
  locale
}) => {
  const [isLoadingForCartCountChange, setIsLoadingForCartCountChange] = useState<boolean>(false)

  useEffect(() => {
    if (fetchOnLoad) {
      fetchCartData()
    }
  }, [])

  if (loading || isLoadingForCartCountChange) {
    return <Loader loadingText={loadingText} />
  }

  if (cartItems.length == 0) {
    return (
      <>
        <p className={Styles.empty_cart_text}>{emptyCardText}</p>
      </>
    )
  }

  return (
    <Box className={cl(`${classNames}`, Styles.cart_list_comp_container)}>
      <CartList
        setIsLoadingForCartCountChange={setIsLoadingForCartCountChange}
        cartItems={cartItems}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        fetchCartData={fetchCartData}
        t={t}
        locale={locale}
      />
      {/* <OrderSummaryBox onOrderClick={onOrderClick} /> */}
    </Box>
  )
}

export default Cart
