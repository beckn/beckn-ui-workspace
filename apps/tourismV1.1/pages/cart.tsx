import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { isEmpty } from '@utils/common-utils'
import { Box, useToast } from '@chakra-ui/react'

import { DOMAIN } from '@lib/config'

import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { cartActions, DiscoveryRootState, getSelectPayload, ICartRootState } from '@beckn-ui/common'

const Cart = () => {
  const [fetchQuotes, { isLoading, data, isError }] = useSelectMutation()
  const dispatch = useDispatch()
  const toast = useToast()

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
    <Box
      className="hideScroll"
      maxH="calc(100vh - 120px)"
      overflowY={'scroll'}
    >
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.name,
            image: singleItem.images?.[0].url!,
            price: Number(singleItem.price.value),
            symbol: singleItem.price.currency,
            handleIncrement: id => {
              const selectedItem = productList.find(singleItem => singleItem.item.id === id)
              console.log('DAnk cart', singleItem, productList)
              if (selectedItem) {
                dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
              }
            },
            handleDecrement: id => {
              dispatch(cartActions.removeItemFromCart(id))
            }
          })),
          loader: { text: 'Getting quotes' },
          orderSummary: {
            totalAmount: {
              price: !isEmpty(data) ? data.data[0].message.order.quote.price.value : totalAmount,
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
    </Box>
  )
}

export default Cart
