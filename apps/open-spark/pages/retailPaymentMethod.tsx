import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { CheckoutRootState, discoveryActions, ICartRootState, PaymentMethodSelectionProps } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { Box } from '@chakra-ui/react'
import phonePay from '@public/images/phonePayPayment.svg'
import gPay from '@public/images/gpay.svg'
import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import { useDispatch, useSelector } from 'react-redux'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const retailPaymentMethod = (props: PaymentMethodSelectionProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)

  const [checkedState, setCheckedState] = useState<string | null>(null)
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    handleOrderConfirmation,
    disableButton = false,
    paymentMethods = [
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
      }
    ]
  } = props

  const handleChange = (id: string) => {
    setSelectedPaymentMethod(id)
    setCheckedPayment(id === checkedState ? null : id)
  }

  return (
    <Box
      className="hideScroll"
      // maxH="calc(100vh - 100px)"
      // overflowY={'scroll'}
    >
      <PaymentDetailsCard
        checkedState={checkedPayment!}
        handleChange={handleChange}
        paymentMethods={paymentMethods}
        t={key => t[key]}
      />
      <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
      >
        <BecknButton
          dataTest={testIds.paymentpage_confirmButton}
          children={t.confirmOrder}
          handleClick={() => {
            if (checkedPayment) {
              // router.push('/retailOrderConfirmation')
              if (selectedPaymentMethod.includes('UPI')) {
                router.push('/upiScreen')
              } else {
                router.push('/secureCheckout')
              }
            }
          }}
          disabled={(!checkedState && !checkedPayment) || disableButton}
        />
      </Box>
    </Box>
  )
}

export default retailPaymentMethod
