import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box, Container } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirm, { isLoading }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState<string>()

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const orderIds: string[] = []
      confirmResponse.forEach(response => {
        orderIds.push(response.message.orderId.slice(0, 8))
      })
      setOrderId(orderIds.join(', '))
    }
  }, [confirmResponse])

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad).then(() => {
        dispatch(cartActions.clearCart())
      })
    }
  }, [])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      confirmResponse.forEach(async response => {
        const ordersPayload = getPayloadForOrderHistoryPost(response, 'food-delivery')
        await axios
          .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
          .then(res => {
            return res
          })
          .catch(err => console.error(err))
      })
    }
  }, [confirmResponse])

  if (isLoading || !confirmResponse) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText="Confirming your order..."
        />
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py="40px"
    >
      <Container maxW="600px">
        <ConfirmationPage
          className="order-confirmation"
          schema={{
            iconSrc: '/images/orderConfirmmark.svg',
            successOrderMessage: 'Order Placed Successfully!',
            gratefulMessage: 'Your order has been confirmed and will be delivered soon.',
            buttons: [
              {
                text: 'View Order Details',
                handleClick: () => {
                  const orderId = confirmResponse[0].message.orderId
                  const bppId = confirmResponse[0].context.bpp_id
                  const bppUri = confirmResponse[0].context.bpp_uri

                  dispatch(orderActions.addSelectedOrder({ orderDetails: { orderId, bppId, bppUri } }))
                  const orderObjectForStatusCall = {
                    bppId: bppId,
                    bppUri: bppUri,
                    orderId: orderId
                  }
                  localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
                  dispatch(checkoutActions.clearState())
                  router.push('/orderDetails')
                },
                disabled: false,
                variant: 'solid',
                colorScheme: 'primary',
                dataTest: testIds.orderConfirmation_viewOrderButton
              },
              {
                text: 'Go Back Home',
                handleClick: () => {
                  router.push('/')
                  dispatch(checkoutActions.clearState())
                },
                disabled: false,
                variant: 'outline',
                colorScheme: 'primary',
                dataTest: testIds.orderConfirmation_goBackToHome
              }
            ]
          }}
        />
      </Container>
    </Box>
  )
}

export default OrderConfirmation
