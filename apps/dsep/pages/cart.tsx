import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartList from '../components/cart/CartList'
import OrderSummaryBox from '../components/cart/OrderSummaryBox'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import { ICartRootState } from '../lib/types/cart'
import { responseDataActions } from '../store/responseData-slice'
import { getItemsForCart, getPayloadForSelectRequest } from '../utilities/cart-utils'
import EmptyCart from '../components/cart/EmptyCart'
import { Box } from '@chakra-ui/react'
import { Item, SelectResponseModel } from '../lib/types/select.types'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { toast } from 'react-toastify'
import { testIds } from '@shared/dataTestIds'

const Cart = () => {
  const [itemsForCart, setItemsForCart] = useState<Item[] | null>(null)
  const [isLoadingForCartCountChange, setIsLoadingForCartCountChange] = useState<boolean>(false)

  const quoteRequest = useRequest()
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const cartItems = useSelector((state: ICartRootState) => state.cart.items)

  const payLoadForQuoteRequest = getPayloadForSelectRequest(cartItems)

  useEffect(() => {
    if (localStorage && !localStorage.getItem('quoteResponse')) {
      if (cartItems.length > 0) {
        quoteRequest.fetchData(`${apiUrl}/select`, 'POST', payLoadForQuoteRequest)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (quoteRequest.data) {
      dispatch(responseDataActions.addQuoteResponse(quoteRequest.data))
      localStorage.setItem('quoteResponse', JSON.stringify(quoteRequest.data))

      const selectResponse: SelectResponseModel = quoteRequest.data

      const items = getItemsForCart(selectResponse.data)
      setItemsForCart(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteRequest.data])

  useEffect(() => {
    if (localStorage) {
      const cachedQuoteResults = localStorage.getItem('quoteResponse')
      if (cachedQuoteResults) {
        const parsedCachedResults = JSON.parse(cachedQuoteResults)
        const items = getItemsForCart(parsedCachedResults.data)
        setItemsForCart(items)
      }
    }
  }, [])

  const onOrderClick = () => {
    router.push('/checkoutPage')
  }

  if (quoteRequest.loading || isLoadingForCartCountChange) {
    // return <Loader loadingText={t.quoteRequestLoader} />
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        data-test={testIds.loadingIndicator}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.quoteRequestLoader}
        />
      </Box>
    )
  }
  if (!cartItems.length) {
    return <EmptyCart />
  }

  if (!itemsForCart) {
    return <></>
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {/* <Breadcrumb /> */}
      <div className="flex justify-center flex-col md:flex-row items-start relative max-w-[2100px] mx-auto">
        <CartList
          cartItemsFromSelect={itemsForCart}
          setIsLoadingForCartCountChange={setIsLoadingForCartCountChange}
        />
        <OrderSummaryBox onOrderClick={onOrderClick} />
      </div>
    </Box>
  )
}

export default Cart
