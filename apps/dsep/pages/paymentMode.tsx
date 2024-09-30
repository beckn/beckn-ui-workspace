import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { cartActions } from '../store/cart-slice'
import { PaymentMethodSelection } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'

function PaymentMode() {
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <>
      <PaymentMethodSelection
        t={key => t[key]}
        handleOrderConfirmation={() => {
          dispatch(cartActions.clearCart())
          router.push('/orderConfirmation')
        }}
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
            category: 'Other',
            paymentMethod: t.payOnline,
            paymentMethodNet: t.cashOnDelivery,
            disabled: false,
            dataTest: testIds.paymentpage_CashOnDelivery
          }
        ]}
      />
    </>
  )
}

export default PaymentMode
