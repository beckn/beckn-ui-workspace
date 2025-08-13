import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelectionProps } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { Box } from '@chakra-ui/react'
import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import { useSelector } from 'react-redux'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { RootState } from '@store/index'

const retailPaymentMethod = (props: PaymentMethodSelectionProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const type = useSelector((state: RootState) => state.navigation.type)
  const [checkedState, setCheckedState] = useState<string | null>(null)
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()

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
      }
      // {
      //   category: 'Other Payment Options',
      //   img: applyPay,
      //   paymentMethod: t.applyPay || 'Apple Pay',
      //   paymentMethodNet: t.applyPay || 'Apple Pay',
      //   disabled: true,
      //   dataTest: testIds.paymentpage_phonePay
      // },
      // {
      //   category: 'Other Payment Options',
      //   img: stripePay,
      //   paymentMethod: t.stripePay || 'Stripe',
      //   paymentMethodNet: t.stripePay || 'Stripe',
      //   disabled: true,
      //   dataTest: testIds.paymentpage_phonePay
      // }
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
          text={t.confirmOrder}
          handleClick={() => {
            if (type === 'RENT_AND_HIRE') {
              if (selectedPaymentMethod.includes('UPI')) {
                router.push('/upiScreen')
              } else {
                router.push('/secureCheckout')
              }
            } else if (checkedPayment) {
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
