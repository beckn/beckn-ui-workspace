import React, { useState, useEffect } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { checkoutActions, StatusRootState } from '@beckn-ui/common'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)
  const [orderId, setOrderId] = useState()

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
        successOrderMessage: t.ordercancelled,
        gratefulMessage: t.orderHasBeenCancelled,
        orderIdMessage: orderId ? `${t.orderNumber}: ${orderId}...` : '',
        trackOrderMessage: t.refundedSoon,

        buttons: [
          {
            text: t.viewDetails,
            handleClick: () => {
              router.push('/orderDetails')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: t.goBackHome,
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
