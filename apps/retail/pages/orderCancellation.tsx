import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { StatusRootState } from '@beckn-ui/common/src/store/status-slice'
import { checkoutActions } from '@beckn-ui/common/src/store/checkout-slice'

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
        successOrderMessage: 'ORDER CANCELLED!',
        gratefulMessage: 'Your order has been successfully cancelled.',
        // orderIdMessage: orderId ? `Order number is: ${orderId}...` : '',
        trackOrderMessage: `Your refund will be processed shortly.`,

        buttons: [
          {
            text: 'Go Back Home',
            handleClick: () => {
              router.push('/')
              dispatch(checkoutActions.clearState())
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: 'View Details',
            handleClick: () => {
              router.push('/orderDetails')
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
