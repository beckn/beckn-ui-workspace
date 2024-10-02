import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { utilGenerateEllipsedText } from '@beckn-ui/molecules'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { ConfirmResponseModel, ICartRootState } from '@beckn-ui/common/lib/types'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import { ORDER_CATEGORY_ID } from '../lib/config'
import { getPayloadForConfirm } from '../utils/payload'
import { cartActions } from '@beckn-ui/common'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])
  const [confirm, { isLoading, data }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState<string>()

  const { totalQuantity } = useSelector((state: ICartRootState) => state.cart)
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
      const payLoad = getPayloadForConfirm(initResponse, totalQuantity)
      confirm(payLoad)
    }
  }, [])

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
          successOrderMessage: 'ORDER SUCCESSFULL',
          gratefulMessage: 'Thank you for your order!',
          orderIdMessage: orderId ? `Order number is: ${utilGenerateEllipsedText(orderId)}` : '',
          orderSummaryMessage: `Your order is confirmed and the actual energy transfer will happen tomorrow from 10:00 AM`,
          buttons: [
            {
              text: 'Go Back Home',
              handleClick: () => {
                router.push('/homePage')
                dispatch(cartActions.clearCart())
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
