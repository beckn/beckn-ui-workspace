import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import CashOnDelivery from '@public/images/cash.svg'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import { testIds } from '@shared/dataTestIds'
import { Box } from '@chakra-ui/react'

const PaymentMode = () => {
  const { t } = useLanguage()
  const router = useRouter()

  const handlePayment = () => {
    // Simulate payment process and then navigate back to RiderModal
    router.push({
      pathname: '/',
      query: { fromPayment: true }
    })
  }

  return (
    <Box mt="110px">
      <PaymentMethodSelection
        t={key => t[key]}
        paymentMethods={[
          {
            category: 'Credit & Debit Cards',
            img: Visa,
            paymentMethod: t.cardNumber,
            paymentMethodNet: t.cardNumber,
            dataTest: testIds.paymentpage_visa
          },
          {
            category: 'Credit & Debit Cards',
            img: masterCard,
            paymentMethod: t.cardNumber,
            paymentMethodNet: t.cardNumber,
            dataTest: testIds.paymentpage_masterCard
          },
          {
            category: 'Other',
            img: CashOnDelivery,
            paymentMethod: t.cashOnDelivery,
            paymentMethodNet: t.netBanking,
            dataTest: testIds.paymentpage_CashOnDelivery
          }
        ]}
        handleOrderConfirmation={() => {
          router.push({
            pathname: '/',
            query: { fromPayment: true }
          })
        }}
      />
    </Box>
  )
}

export default PaymentMode
