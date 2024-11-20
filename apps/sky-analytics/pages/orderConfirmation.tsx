import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { ConfirmResponseModel } from '@beckn-ui/common/lib/types'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import { ORDER_CATEGORY_ID } from '../lib/config'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '../utils/payload'
import { cartActions, feedbackActions } from '@beckn-ui/common'
import { RootState } from '@store/index'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])
  const [confirm, { isLoading, error, isSuccess }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState<string>()

  const { user } = useSelector((state: RootState) => state.auth)
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      setOrderId(confirmResponse[0].message.orderId.slice(0, 8))
    }
  }, [confirmResponse])

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad).then(data => {
        if (error) {
          console.error(error)
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
            })
          )
          router.back()
          dispatch(cartActions.clearCart())
        }
      })
    }
  }, [initResponse])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const ordersPayload = getPayloadForOrderHistoryPost(confirmResponse, ORDER_CATEGORY_ID)
      console.log(ordersPayload)
      ordersPayload.forEach((payload: any) => {
        axios
          .post(`${strapiUrl}/orders`, payload, axiosConfig)
          .then(res => {
            return res
          })
          .catch(err => {
            console.error(err)
            dispatch(
              feedbackActions.setToastData({
                toastData: { message: 'Error', display: true, type: 'error', description: t.errorText }
              })
            )
            router.back()
          })
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
    <Box mt={'-2rem'}>
      <ConfirmationPage
        className="kuza-order-confornation"
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: 'Request Confirmed!',
          gratefulMessage: 'The dataset will be shared via the chosen mode',
          orderIdMessage: '',
          trackOrderMessage: user?.email ? `<email ID: ${user?.email}>` : '',
          buttons: [
            {
              text: 'Go Back Home',
              handleClick: () => {
                router.push('/')
                dispatch(checkoutActions.clearState())
              },
              disabled: false,
              variant: 'solid',
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
