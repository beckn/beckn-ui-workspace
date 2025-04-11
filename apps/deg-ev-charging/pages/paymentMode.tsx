import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelectionProps } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { Box } from '@chakra-ui/react'

import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [checkedState, setCheckedState] = useState<string | null>(null)
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()

  const {
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
    ]
  } = props

  const handleChange = (id: string) => {
    setSelectedPaymentMethod(id)
    setCheckedPayment(id === checkedState ? null : id)
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <PaymentDetailsCard
        checkedState={checkedPayment!}
        handleChange={handleChange}
        paymentMethods={paymentMethods}
        t={key => t[key]}
      />
      <BecknButton
        dataTest={testIds.paymentpage_confirmButton}
        sx={{
          marginTop: '2rem'
        }}
        text={t.confirmOrder}
        handleClick={() => {
          setOpenModal(true)
          if (checkedPayment) {
            router.push('/secureCheckout')
          }
        }}
        disabled={!checkedPayment || disableButton}
      />
    </Box>
  )
}

export default PaymentMode
