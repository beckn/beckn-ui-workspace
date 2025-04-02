import { useRouter } from 'next/router'

import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart, CurrencyType } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { CartItemProps } from '@beckn-ui/becknified-components/src/components/cart/cart.types'
import { getSelectPayload } from '@beckn-ui/common/src/utils'
import { DiscoveryRootState, ICartRootState, Quote } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import { CheckoutRootState } from '@beckn-ui/common'
import { checkoutActions } from '@beckn-ui/common/src/store/checkout-slice'
const Cart = () => {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [fetchQuotes, { isLoading }] = useSelectMutation()
  const dispatch = useDispatch()

  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const prevTotalQuantityRef = useRef(totalQuantity)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const { selectResponse } = useSelector((state: CheckoutRootState) => state.checkout)

  useEffect(() => {
    if (items.length > 0) {
      fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
    }
    if (prevTotalQuantityRef.current !== totalQuantity) {
      dispatch(checkoutActions.resetInitResponse())
      prevTotalQuantityRef.current = totalQuantity
    }
  }, [totalQuantity])

  useEffect(() => {
    if (selectResponse && selectResponse.length > 0) {
      const finalQuote = { value: 0, currency: 'INR' }
      selectResponse.forEach(response => {
        const qoute = response.message.order.quote
        if (Number(qoute.price.value)) {
          finalQuote.value = finalQuote.value + Number(qoute.price.value)
          finalQuote.currency = qoute.price.currency
        }
      })
      setQuote({
        price: { value: finalQuote.value.toString(), currency: finalQuote.currency as CurrencyType },
        breakup: []
      })
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
      pt={['0px', '20px', '0px', '0px']}
      className="hideScroll"
      maxH="calc(100vh - 90px)"
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
                providerName: singleItem.providerName,
                shortDesc: singleItem.short_desc,
                price: Number(singleItem?.price.value),
                symbol: singleItem?.price.currency,
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
              }) as CartItemProps
          ),
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
              text: t.order,
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
