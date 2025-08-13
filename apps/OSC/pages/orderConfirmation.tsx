import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import {
  cartActions,
  checkoutActions,
  CheckoutRootState,
  getPayloadForConfirm,
  getPayloadForOrderHistoryPost,
  orderActions
} from '@beckn-ui/common'
import { ORDER_CATEGORY_ID } from '../lib/config'
import { testIds } from '@shared/dataTestIds'
import { utilGenerateEllipsedText } from '@beckn-ui/molecules'
const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirm, { isLoading }] = useConfirmMutation()
  const [orderId, setOrderId] = useState<string>()
  const dispatch = useDispatch()

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

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
      const orderIds: string[] = []
      confirmResponse.forEach(response => {
        orderIds.push(utilGenerateEllipsedText(response.message.orderId))
      })
      setOrderId(orderIds.join(', '))
    }
  }, [confirmResponse])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      confirmResponse.forEach(async response => {
        const ordersPayload = getPayloadForOrderHistoryPost(response, ORDER_CATEGORY_ID)
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
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.confirmLoaderSubtext}
        />
      </Box>
    )
  }

  return (
    <Box mt="-2rem">
      <ConfirmationPage
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: t.orderSuccessfull,
          gratefulMessage: t.thankYouForOrder,
          orderIdMessage: orderId ? `${t.orderNumber}: ${orderId}` : '',
          trackOrderMessage: t.youCanTrack,

          buttons: [
            {
              text: t.viewOrderDetails,
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
              text: t.goBackHome,
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
    </Box>
  )
}

export default OrderConfirmation
