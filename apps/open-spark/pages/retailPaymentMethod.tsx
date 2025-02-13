import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import phonePay from '../public/images/phonePayPayment.svg'
import CashOnDelivery from '@public/images/cash.svg'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import NetBanking from '@public/images/netbanking.svg'
import gPay from '@public/images/gpay.svg'

const RetailPaymentMode = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <PaymentMethodSelection
      t={key => t[key]}
      handleOrderConfirmation={() => router.push('/retailOrderConfirmation')}
      paymentMethods={[
        {
          category: 'Credit & Debit Cards',
          img: Visa,
          paymentMethod: t.cardNumber,
          paymentMethodNet: t.cardNumber,
          disabled: false,
          dataTest: testIds.paymentpage_visa
        },
        {
          category: 'Credit & Debit Cards',
          img: masterCard,
          paymentMethod: t.cardNumber,
          paymentMethodNet: t.cardNumber,
          disabled: false,
          dataTest: testIds.paymentpage_masterCard
        },
        {
          category: 'UPI',
          img: gPay,
          paymentMethod: t.gPay || 'Google Pay',
          paymentMethodNet: t.gPay || 'Google Pay',
          disabled: false,
          dataTest: testIds.paymentpage_phonePay
        },
        {
          category: 'UPI',
          img: phonePay,
          paymentMethod: t.phonePay || 'PhonePe UPI',
          paymentMethodNet: t.phonePay || 'PhonePe UPI',
          disabled: false,
          dataTest: testIds.paymentpage_phonePay
        },
        {
          category: 'Other',
          img: NetBanking,
          paymentMethod: t.netBanking,
          paymentMethodNet: t.netBanking,
          disabled: false,
          dataTest: testIds.paymentpage_NetBanking
        },
        {
          category: 'Other',
          img: CashOnDelivery,
          paymentMethod: 'Cash on Delivery',
          paymentMethodNet: 'Cash on Delivery',
          disabled: false,
          dataTest: testIds.paymentpage_CashOnDelivery
        }
      ]}
    />
  )
}

export default RetailPaymentMode
