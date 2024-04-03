import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { InitResponseModel } from '../types/init.types'
import { CheckoutRootState } from '@store/checkout-slice'
import { useConfirmMutation } from '@services/confirm'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/confirm-utils'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { ConfirmResponseModel } from '../types/confirm.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { init } from 'next/dist/compiled/webpack/webpack'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])
  const [confirm, { isLoading, data }] = useConfirmMutation()

  console.log('Dank confirm', data)

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
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      // console.log("Dank payload",payLoad)
      confirm(payLoad)
    }
  }, [])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const ordersPayload = getPayloadForOrderHistoryPost(confirmResponse)
      axios
        .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
        .then(res => {
          return res
        })
        .catch(err => console.error(err))
    }
  }, [confirmResponse])

  if (isLoading) {
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
    <ConfirmationPage
      schema={{
        iconSrc: orderConfirmmark,
        content: t.orderPlaced,
        contentMessage: t.orderSuccesfully,
        buttons: [
          {
            text: 'View Details',
            handleClick: () => {
              router.push('/orderDetails')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: 'Go Back Home',
            handleClick: () => {
              router.push('/homePage')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary'
          }
        ]
      }}
    />
  )
}

export default OrderConfirmation
