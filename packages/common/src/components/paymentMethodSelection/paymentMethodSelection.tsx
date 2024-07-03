import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import phonePay from '../../../public/images/phonePayPayment.svg'
import CashOnDelivery from '../../../public/images/cash.svg'
import Visa from '../../../public/images/visa.svg'
import masterCard from '../../../public/images/masterCard.svg'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { PaymentMethodSelectionProps } from '../../../lib/types/components'
import PaymentDetailsCard from '../card/PaymentDetailsCard'

const PaymentMethodSelection = (props: PaymentMethodSelectionProps) => {
  const { t, handleOrderConfirmation } = props
  const [checkedState, setCheckedState] = useState<string | null>(null)

  const handleChange = (id: string) => {
    setCheckedState(id === checkedState ? null : id)
  }

  return (
    <Box
      mt={['20px', '20px', '0px', '0px']}
      className="hideScroll"
      maxH="calc(100vh - 120px)"
      overflowY={'scroll'}
    >
      <Box
        position={'relative'}
        maxWidth={{ base: '90%', md: '70%' }}
        margin="auto"
      >
        <Box>
          <PaymentDetailsCard
            t={t}
            checkedState={checkedState!}
            handleChange={handleChange}
            paymentMethods={[
              {
                category: 'Credit & Debit Cards',
                img: Visa,
                paymentMethod: t('cardNumber'),
                paymentMethodNet: t('cardNumber')
              },
              {
                category: 'Credit & Debit Cards',
                img: masterCard,
                paymentMethod: t('cardNumber'),
                paymentMethodNet: t('cardNumber')
              },
              {
                category: 'UPI',
                img: phonePay,
                paymentMethod: t('phonePay') || 'PhonePe UPI',
                paymentMethodNet: t('phonePay') || 'PhonePe UPI'
              },
              {
                category: 'Other',
                img: CashOnDelivery,
                paymentMethod: t('cashOnDelivery'),
                paymentMethodNet: t('netBanking')
              }
            ]}
          />
        </Box>

        <Box
          width={{ base: '100%', md: '70%' }}
          style={{ marginTop: '2rem ' }}
        >
          <BecknButton
            children={t('confirmOrder')}
            handleClick={handleOrderConfirmation}
            disabled={!checkedState}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentMethodSelection
