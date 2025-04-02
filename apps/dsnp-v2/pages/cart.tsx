import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart, CurrencyType } from '@beckn-ui/becknified-components'

import { Box } from '@chakra-ui/react'

import { DOMAIN } from '@lib/config'

import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import {
  cartActions,
  CheckoutRootState,
  DiscoveryRootState,
  getSelectPayload,
  ICartRootState,
  Quote
} from '@beckn-ui/common'

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

  const onOrderClick = () => {
    router.push('/checkout')
  }
  const handleShopButton = () => {
    router.push('/')
  }

  return (
    <Box
      pt={['0px', '20px', '0px', '0px']}
      className="hideScroll"
      maxH="calc(100vh - 90px)"
    >
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: items.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.name,
            image: singleItem.images?.[0].url || '',
            providerName: singleItem.providerName,
            shortDesc: singleItem.short_desc,
            price: Number(singleItem?.price.value),
            symbol: singleItem.price.currency as CurrencyType,
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
          })),
          loader: { loadingText: t.pleaseWait, loadingSubText: t.quoteRequestLoader },
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
              text: 'Proceed to checkout',
              handleClick: onOrderClick
            }
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
