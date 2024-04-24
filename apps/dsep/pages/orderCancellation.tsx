import { useRouter } from 'next/router'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import React from 'react'
import { useLanguage } from '../hooks/useLanguage'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <ConfirmationPage
      schema={{
        iconSrc: '/images/orderCancelled.svg',
        successOrderMessage: t.courseCancelled,
        gratefulMessage: '',
        orderIdMessage: t.courseCancelConfirmText,

        buttons: [
          {
            text: 'Go Back Home',
            handleClick: () => {
              router.push('/')
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
