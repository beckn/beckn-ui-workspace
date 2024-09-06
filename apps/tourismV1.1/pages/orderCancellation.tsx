import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { checkoutActions, StatusRootState } from '@beckn-ui/common'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const statusResponse = useSelector((state: StatusRootState) => state.status.statusResponse)
  const [orderId, setOrderId] = useState<string>()
  const dispatch = useDispatch()

  useEffect(() => {
    if (statusResponse && statusResponse.length > 0 && statusResponse[0].message.order.id) {
      setOrderId(statusResponse[0].message.order.id.slice(0, 8))
    }
  }, [statusResponse])

  return (
    <ConfirmationPage
      schema={{
        iconSrc: '/images/cancleHomeImg.svg',
        // content: t.orderPlaced,
        // contentMessage: t.orderSuccesfully,
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
