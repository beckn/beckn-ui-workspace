import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { useSelectMutation } from '@services/select'
import { getSelectPayload } from '@components/cart/cart.utils'
import { cartActions } from '@store/cart-slice'
import { isEmpty } from '@utils/common-utils'
import { CustomToast } from '@components/signIn/SignIn'
import { Box, useToast } from '@chakra-ui/react'

import { DOMAIN } from '@lib/config'

import { ICartRootState } from '@lib/types'
import { DiscoveryRootState } from '@store/discovery-slice'

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

  useEffect(() => {
    if (isError) {
      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message="Unable to proceed with select request"
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }, [isError])

  const onOrderClick = () => {
    router.push('/checkout')
  }

  return (
    <Box mt={['20px', '20px', '0px', '0px']}>
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
          loader: { text: t.quoteRequestLoader },
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
