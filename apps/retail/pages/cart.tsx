import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { useSelectMutation } from '@services/select'
import { getSelectPayload } from '@components/cart/cart.utils'
import { cartActions } from '@store/cart-slice'
import { DOMAIN } from '@lib/config'

import { ICartRootState } from '@lib/types'
import { DiscoveryRootState } from '@store/discovery-slice'

const Cart = () => {
  const [fetchQuotes, { isLoading }] = useSelectMutation()
  const dispatch = useDispatch()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const totalAmount = useSelector((state: ICartRootState) => state.cart.totalAmount)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
  }, [totalQuantity])

  const onOrderClick = () => {
    router.push('/checkout')
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
            symbol: singleItem.price.currency,
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
          loader: { text: 'Loading cart' },
          orderSummary: {
            totalAmount: {
              price: totalAmount,
              currencyType: items[0].price.currency
            },
            totalQuantity: {
              text: totalQuantity.toString(),
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
