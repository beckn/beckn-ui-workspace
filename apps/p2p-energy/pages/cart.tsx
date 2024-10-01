import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'

import { Box, useToast } from '@chakra-ui/react'

import { CartItemProps } from '@beckn-ui/becknified-components/src/components/cart/cart.types'
import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { testIds } from '@shared/dataTestIds'
import { getSelectPayload } from '../utils/payload'
import { feedbackActions } from '@beckn-ui/common'

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
    if (items.length > 0) {
      try {
        fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
      } catch (error) {
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
          })
        )
        router.back()
      }
    }
  }, [totalQuantity])

  const handleShopButton = () => {
    router.push('/homePage')
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
          loader: { text: t.quoteRequestLoader, dataTest: testIds.loadingIndicator },
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
              text: t.procced,
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
