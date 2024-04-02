import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { useSelectMutation } from '@services/select'
import { getSelectPayload } from './cart.utils'
import { cartActions } from '@store/cart-slice'

import { ICartRootState } from '@lib/types'
import { DiscoveryRootState } from '@store/discovery-slice'

const Cart = () => {
  const [fetchQuotes, { isLoading }] = useSelectMutation()
  const dispatch = useDispatch()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    fetchQuotes(getSelectPayload(items, transactionId))
  }, [totalQuantity])

  const onOrderClick = () => {
    router.push('/checkoutPage')
  }

  return (
    <div>
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.name,
            image: singleItem.images[0].url,
            price: Number(singleItem.price.value),
            symbol: '€',
            handleIncrement: id => {
              const selectedItem = productList.find(singleItem => singleItem.id === id)
              if (selectedItem) {
                dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
              }
            },
            handleDecrement: id => {
              dispatch(cartActions.removeItemFromCart(id))
            }
          })),
          loader: { text: 'Loading....' },
          orderSummary: {
            totalAmount: {
              price: 25
            },
            totalQuantity: {
              text: '3',
              variant: 'subTitleSemibold'
            },
            pageCTA: {
              text: 'Proceed to checkout',
              handleClick: onOrderClick
            }
          }
        }}
      />
    </div>
  )
}

export default Cart
