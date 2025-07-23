import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { CheckoutRootState, cartActions, checkoutActions, orderActions } from '@beckn-ui/common/src/store'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/confirm-utils'
import axios from '@services/axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { utilGenerateEllipsedText } from '@beckn-ui/molecules'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import { OrderConfirmationModal } from '@beckn-ui/common'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderId, setOrderId] = useState<string>()
  const [confirm, { isLoading, isError }] = useConfirmMutation()
  const dispatch = useDispatch()

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
        orderIds.push(utilGenerateEllipsedText(response.message.orderId))
      })
      setOrderId(orderIds.join(', '))
    }
  }, [confirmResponse])

  const handleConfirm = () => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad).then(() => {
        dispatch(cartActions.clearCart())
      })
    }
  }

  useEffect(() => {
    handleConfirm()
  }, [])

  useEffect(() => {
    if (isError) {
      setIsModalOpen(true)
    }
  }, [isError])

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

  if (isError && isModalOpen) {
    return (
      <>
        <OrderConfirmationModal
          isOpen={isModalOpen}
          headerText="Order Confirmation Failed"
          subHeaderText="We couldn't confirm your order. Please try again or go back to home."
          onClose={() => setIsModalOpen(false)}
          onRetry={handleConfirm}
          onGoTo={{
            onClick: () => {
              router.push('/')
              dispatch(checkoutActions.clearState())
            },
            text: 'Go Back Home'
          }}
        />
      </>
    )
  }

  return (
    <Box mt={'-2rem'}>
      <ConfirmationPage
        className="kuza-order-confornation"
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: 'ORDER SUCCESFULL',
          gratefulMessage: 'Thank you for your order!',
          orderIdMessage: confirmResponse && confirmResponse.length > 0 ? `Order number is: ${orderId}` : '',
          trackOrderMessage: `You can track your order in "My Order" section`,

          buttons: [
            {
              text: 'View Case Details',
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
    </Box>
  )
}

export default OrderConfirmation
