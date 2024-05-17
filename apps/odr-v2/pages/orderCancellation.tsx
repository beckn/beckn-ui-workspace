import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { StatusRootState } from '@store/status-slice'
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import React, { useState } from 'react'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState()
  return (
    <ConfirmationPage
      schema={{
        iconSrc: '/images/cancleHomeImg.svg',
        // content: t.orderPlaced,
        // contentMessage: t.orderSuccesfully,
        successOrderMessage: 'ORDER CANCELLED!',
        gratefulMessage: 'Your Order has been cancelled',
        orderIdMessage: orderId ? `Order number is: ${orderId}...` : '',
        trackOrderMessage: `If you have already paid, you will be refunded soon.`,

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
