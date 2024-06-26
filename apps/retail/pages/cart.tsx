import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'

import { Box, useToast } from '@chakra-ui/react'

import { CartItemProps } from '@beckn-ui/becknified-components/src/components/cart/cart.types'
import { getSelectPayload } from '@utils/cart-utils'
import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { DOMAIN } from '@beckn-ui/common'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'

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

  const handleShopButton = () => {
    router.push('/')
  }

  const onOrderClick = () => {
    router.push('/checkout')
  }

  return (
    <Box
      pt={['20px', '20px', '0px', '0px']}
      className="hideScroll"
      maxH="calc(100vh - 120px)"
      overflowY={'scroll'}
    >
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(
            singleItem =>
              ({
                id: singleItem.id,
                quantity: singleItem.quantity,
                name: singleItem.name,
                image: singleItem.images?.[0].url,
                price: Number(singleItem.price.value),
                symbol: singleItem.price.currency,
                totalAmountText: t.totalAmount,
                handleIncrement: id => {
                  const selectedItem = productList.find(singleItem => singleItem.item.id === id)
                  if (selectedItem) {
                    dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
                  }
                },
                handleDecrement: id => {
                  dispatch(cartActions.removeItemFromCart(id))
                }
              }) as CartItemProps
          ),
          loader: { text: t.quoteRequestLoader },
          orderSummary: {
            totalAmount: {
              price: totalAmount,
              currencyType: items[0]?.price.currency
            },
            totalQuantity: {
              text: totalQuantity.toString(),
              variant: 'subTitleSemibold'
            },
            pageCTA: {
              text: t.order,
              handleClick: onOrderClick
            },
            orderSummaryText: t.orderSummary,
            totalQuantityText: t.totalQuantity,
            totalAmountText: t.totalAmount
          },
          emptyCard: {
            image: '/images/emptyCard.svg',
            heading: t.emptyCardHeading,
            subHeading: t.emptyCardSubHeading,
            buttonText: t.shop,
            buttonHanler: handleShopButton
          }
        }}
      />
    </Box>
  )
}

export default Cart
