import { useRouter } from 'next/router'

import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { useSelectMutation } from '@services/select'
import { getSelectPayload } from '@components/cart/cart.utils'
import { cartActions } from '@store/cart-slice'

import { Box, useToast } from '@chakra-ui/react'

import { DOMAIN } from '@lib/config'

import { ICartRootState } from '@lib/types'
import { DiscoveryRootState } from '@store/discovery-slice'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'

const Cart = () => {
  const [fetchQuotes, { isLoading, data, isError }] = useSelectMutation()
  const dispatch = useDispatch()

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

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.selectLoaderSubText}
        />
      </Box>
    )
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
            image: singleItem.images[0].url,
            price: Number(singleItem.price.value),
            symbol: singleItem.price.currency,
            handleIncrement: id => {
              const selectedItem = productList.find(singleItem => singleItem.item.id === id)
              if (selectedItem) {
                dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
              }
            },
            handleDecrement: id => {
              dispatch(cartActions.removeItemFromCart(id))
            }
          })),
          loader: { text: 'Getting quotes' }, // optional loader
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
              text: t.proceedTOCheckout,
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
