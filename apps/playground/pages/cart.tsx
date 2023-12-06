import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartList from '../components/cart/CartList'
import OrderSummaryBox from '../components/cart/OrderSummaryBox'
import { useLanguage } from '../hooks/useLanguage'
import Loader from '../components/loader/Loader'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import useRequest from '../hooks/useRequest'
import {
  DataPerBpp,
  CartItemForRequest,
  ICartRootState,
  TransactionIdRootState,
  CartRetailItem
} from '../lib/types/cart'
import { responseDataActions } from '../store/responseData-slice'
import { getCartItemsPerBpp, getItemsForCart, getPayloadForQuoteRequest } from '../utilities/cart-utils'

const Cart = () => {
  const [itemsForCart, setItemsForCart] = useState<CartRetailItem[]>([])
  const [isLoadingForCartCountChange, setIsLoadingForCartCountChange] = useState<boolean>(false)

  const quoteRequest = useRequest()
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)
  const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(cartItems as CartItemForRequest[])
  const payLoadForQuoteRequest = getPayloadForQuoteRequest(cartItemsPerBppPerProvider, transactionId)
  const fetchItems = () => {
    return new Promise(() => {})
  }

  useEffect(() => {
    if ((localStorage && !localStorage.getItem('quoteResponse')) || localStorage.getItem('quoteResponse')) {
      quoteRequest.fetchData(`${apiUrl}/client/v2/get_quote`, 'POST', payLoadForQuoteRequest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (quoteRequest.data) {
      dispatch(responseDataActions.addQuoteResponse(quoteRequest.data))
      localStorage.setItem('quoteResponse', JSON.stringify(quoteRequest.data))

      const items = getItemsForCart(quoteRequest.data)
      setItemsForCart(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteRequest.data])

  useEffect(() => {
    if (localStorage) {
      const cachedQuoteResults = localStorage.getItem('quoteResponse')
      if (cachedQuoteResults) {
        const parsedCachedResults = JSON.parse(cachedQuoteResults)
        setItemsForCart(parsedCachedResults)
      }
    }
  }, [])

  const onOrderClick = () => {
    router.push('/checkoutPage')
  }

  if (quoteRequest.loading || isLoadingForCartCountChange) {
    return <Loader loadingText={t.quoteRequestLoader} />
  }

  if (!itemsForCart.length) {
    return (
      <>
        <p className="mt-20 text-center text-palette-mute font-normal">{t.cartIsEmpty}</p>
      </>
    )
  }
  return (
    <div>
      <BecknCart
        schema={{
          cartItems: cartItems.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.descriptor.name,
            image: singleItem.descriptor.images[0],
            price: Number(singleItem.price.value),
            symbol: '€',
            handleIncrement: () => {
              console.log('Incremented')
            },
            handleDecrement: () => {
              console.log('Decremented')
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
              text: 'Proceed to buy',
              handleClick: onOrderClick
            }
          }
        }}
      />
    </div>
  )
}

export default Cart
