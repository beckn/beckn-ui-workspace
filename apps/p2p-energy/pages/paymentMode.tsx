import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import phonePay from '@public/images/phonePayPayment.svg'
import BillIcon from '@public/images/bill.svg'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'

const PaymentMode = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <PaymentMethodSelection
      t={key => t[key]}
      handleOrderConfirmation={() => router.push('/orderConfirmation')}
      paymentMethods={[
        {
          category: 'Credit & Debit Cards',
          img: Visa,
          paymentMethod: t.cardNumber,
          paymentMethodNet: t.cardNumber,
          disabled: true
        },
        {
          category: 'Credit & Debit Cards',
          img: masterCard,
          paymentMethod: t.cardNumber,
          paymentMethodNet: t.cardNumber,
          disabled: true
        },
        {
          category: 'UPI',
          img: phonePay,
          paymentMethod: t.phonePay || 'PhonePe UPI',
          paymentMethodNet: t.phonePay || 'PhonePe UPI',
          disabled: true
        },
        {
          category: 'Other',
          img: BillIcon,
          paymentMethod: t.cashOnDelivery,
          paymentMethodNet: t.netBanking,
          disabled: false
        }
      ]}
    />
  )
}

export default PaymentMode
