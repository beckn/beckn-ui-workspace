import { useRouter } from 'next/router'

import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import {
  ICartRootState,
  DiscoveryRootState,
  getSelectPayload,
  cartActions,
  CheckoutRootState,
  Quote
} from '@beckn-ui/common'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import { CartItemProps } from '@beckn-ui/becknified-components/src/components/cart/cart.types'

const Cart = () => {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [fetchQuotes, { isLoading }] = useSelectMutation()
  const dispatch = useDispatch()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const { selectResponse } = useSelector((state: CheckoutRootState) => state.checkout)

  useEffect(() => {
    if (items.length > 0) {
      fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
    }
  }, [totalQuantity])

  useEffect(() => {
    if (selectResponse && selectResponse.length > 0) {
      const qoute = selectResponse[0].message.order.quote
      setQuote(qoute)
    }
  }, [selectResponse])

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
          cartItems: items.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.name,
            image: singleItem.images?.[0].url,
            price: Number(quote?.price.value),
            symbol: quote?.price.currency,
            totalAmountText: t.totalAmount,
            handleIncrement: id => {
              const selectedItem = productList.find(singleItem => singleItem.item.id === id)
              if (selectedItem) {
                dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
              }
            },
            handleDecrement: id => {
              const selectedItem = productList.find(singleItem => singleItem.item.id === id)
              if (selectedItem) {
                dispatch(cartActions.removeItemFromCart(id))
              }
            }
          })) as CartItemProps[],
          loader: {
            loadingText: t.pleaseWait,
            loadingSubText: t.quoteRequestLoader,
            dataTest: testIds.loadingIndicator
          },
          orderSummary: {
            totalAmount: {
              price: Number(quote?.price.value),
              currencyType: quote?.price.currency
            },
            totalQuantity: {
              text: totalQuantity.toString(),
              variant: 'subTitleSemibold'
            },
            pageCTA: {
              text: t.proceedTOCheckout,
              handleClick: onOrderClick
            },
            orderSummaryText: t.orderSummary,
            totalQuantityText: t.totalQuantity,
            totalAmountText: t.totalAmount,
            dataTestTotalQuantity: testIds.cartpage_totalQuantityText,
            dataTestTotalAmount: testIds.cartpage_totalAmountText,
            dataTestCta: testIds.cartpage_cartOrderButton
          },
          emptyCard: {
            image: '/images/emptyCard.svg',
            heading: t.emptyCardHeading,
            subHeading: t.emptyCardSubHeading,
            buttonText: t.shop,
            buttonHanler: handleShopButton,
            dataTestImage: testIds.cartpage_emptyImage,
            dataTestHeading: testIds.cartpage_emptyheading,
            dataTestSubHeading: testIds.cartpage_emptySubHeading,
            dataTestCta: testIds.cartpage_emptyButton
          }
        }}
      />
    </Box>
  )
}

export default Cart
