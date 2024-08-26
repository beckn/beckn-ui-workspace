import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import phonePay from '../public/images/phonePayPayment.svg'
import CashOnDelivery from '@public/images/cash.svg'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { testIds } from '@shared/dataTestIds'
import NetBanking from '@public/images/netbanking.svg'

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
          disabled: true,
          dataTest: testIds.paymentpage_visa
        },
        {
          category: 'Credit & Debit Cards',
          img: masterCard,
          paymentMethod: t.cardNumber,
          paymentMethodNet: t.cardNumber,
          disabled: true,
          dataTest: testIds.paymentpage_masterCard
        },
        {
          category: 'UPI',
          img: phonePay,
          paymentMethod: t.phonePay || 'PhonePe UPI',
          paymentMethodNet: t.phonePay || 'PhonePe UPI',
          disabled: true,
          dataTest: testIds.paymentpage_phonePay
        },
        {
          category: 'Other',
          img: NetBanking,
          paymentMethod: t.netBanking,
          paymentMethodNet: t.netBanking,
          disabled: true,
          dataTest: testIds.paymentpage_NetBanking
        },
        {
          category: 'Other',
          img: CashOnDelivery,
          paymentMethod: t.cashOnDelivery,
          paymentMethodNet: t.cashOnDelivery,
          disabled: false,
          dataTest: testIds.paymentpage_CashOnDelivery
        }
      ]}
    />
  )
}

export default PaymentMode
