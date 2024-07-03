import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'

const PaymentMode = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <PaymentMethodSelection
      t={key => t[key]}
      handleOrderConfirmation={() => router.push('/orderConfirmation')}
    />
  )
}

export default PaymentMode
