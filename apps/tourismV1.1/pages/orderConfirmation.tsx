import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { getPayloadForConfirm, getPayloadForOrder } from '@utils/confirm-utils'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { ConfirmResponseModel } from '../types/confirm.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { orderObjectUrlActions } from '@store/orderObjectUrl-slice'
import { utilGenerateEllipsedText } from '@beckn-ui/molecules'
import axios from '@services/axios'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { checkoutActions, CheckoutRootState, orderActions } from '@beckn-ui/common'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])
  const [confirm, { isLoading, data }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState()
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
      setOrderId(confirmResponse[0].message.orderId)
    }
  }, [confirmResponse])

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad)
    }
  }, [])
  // useEffect(() => {
  //   if (confirmResponse && confirmResponse.length > 0) {
  //     const ordersPayload = getPayloadForOrderHistoryPost(confirmResponse)
  //     axios
  //       .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
  //       .then(res => {
  //         return res
  //       })
  //       .catch(err => console.error(err))
  //   }
  // }, [confirmResponse])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const ordersPayload = getPayloadForOrder(confirmResponse)
      axios
        .post(`https://bap-s3integration-api-dev.becknprotocol.io/orders`, ordersPayload, axiosConfig)
        .then(res => {
          const qrUrl = res?.data?.qr_url
          dispatch(orderObjectUrlActions.addOrderObjectUrl(qrUrl))
          const tags = confirmResponse[0].message.items[0].tags
          const tags1 = tags[0].list
          console.log(tags1)
          const parisTag = tags1.find(tag => tag.name === 'Paris')
          console.log(parisTag)
          const isCityOfParisItem = parisTag.name === 'Paris'
          console.log(isCityOfParisItem)
          if (isCityOfParisItem) {
            dispatch(orderObjectUrlActions.setisFlowCityOfParis(true))
          }
          return res
        })
        .catch(err => console.error(err))
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
          loadingText={t.catalogLoader}
          loadingSubText={t.confirmingOrderLoader}
        />
      </Box>
    )
  }

  return (
    <Box mt="-4rem">
      <ConfirmationPage
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: `${t.orderPlaced}`,
          gratefulMessage: `${t.confirmMessage}`,
          orderIdMessage: orderId ? `${t.orderNumber} ${utilGenerateEllipsedText(orderId)}` : '',
          trackOrderMessage: `${t.trackOrderMessage}`,

          buttons: [
            {
              text: `${t.viewDetails}`,
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
              colorScheme: 'primary'
            },
            {
              text: `${t.goBackBtn}`,
              handleClick: () => {
                router.push('/')
                dispatch(checkoutActions.clearState())
              },
              disabled: false,
              variant: 'outline',
              colorScheme: 'primary'
            }
          ]
        }}
      />
    </Box>
  )
}

export default OrderConfirmation
