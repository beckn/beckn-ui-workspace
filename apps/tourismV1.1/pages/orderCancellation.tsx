import React, { useEffect, useState } from 'react'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { StatusRootState } from '@store/status-slice'
import { useSelector, useDispatch } from 'react-redux'

import { ConfirmationPage } from '@beckn-ui/becknified-components'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [orderId, setOrderId] = useState()
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)

  useEffect(() => {
    if (statusResponse && statusResponse.length > 0 && statusResponse[0].message.order.id) {
      setOrderId(statusResponse[0].message.order.id.slice(0, 8))
    }
  }, [statusResponse])

  const dispatch = useDispatch()
  return (
    <ConfirmationPage
      schema={{
        iconSrc: '/images/cancleHomeImg.svg',
        content: t.orderPlaced,
        contentMessage: t.orderSuccesfully,
        successOrderMessage: `${t.orderCancelled}`,
        gratefulMessage: `${t.cancelText}`,
        orderIdMessage: orderId ? `${t.orderNumber} ${orderId}...` : '',
        trackOrderMessage: `${t.refundText}`,

        buttons: [
          {
            text: `${t.viewDetails}`,
            handleClick: () => {
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
  )
}

export default orderCancellation
