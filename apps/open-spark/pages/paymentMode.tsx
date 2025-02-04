import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import SBI from '@public/images/sbi.svg'
import HDFC from '@public/images/hdfc.svg'
import phonePay from '@public/images/phonePayPayment.svg'
import CashOnDelivery from '@public/images/cash.svg'
import NetBanking from '@public/images/netbanking.svg'
import { Input } from '@beckn-ui/molecules'

function PaymentMode() {
  const { t } = useLanguage()
  const router = useRouter()

  const [amount, setAmount] = useState('')
  const [formErrors, setFormErrors] = useState<{ name: string }>({
    name: ''
  })

  const validateForm = (data: any) => {
    if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(data.name.trim())) {
      return { name: 'errorAmount' }
    }
    return {}
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log(`handleInputChange`, e.target)
    setAmount(value)

    const formData = {
      [name]: value
    }

    const errors: any = validateForm(formData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  return (
    <>
      <Input
        type="number"
        name="name"
        value={amount}
        handleChange={handleInputChange}
        label="Enter Amount"
        error={formErrors.name}
      />
      <PaymentMethodSelection
        t={key => t[key]}
        handleOrderConfirmation={() => {
          router.push('/orderConfirmation')
        }}
        paymentMethods={[
          {
            category: 'Select Bank',
            img: HDFC,
            paymentMethod: 'State Bank Of India',
            paymentDescription: 'Account no: *****3546',
            paymentMethodNet: t.cardNumber,
            disabled: false
          },
          {
            category: 'Select Bank',
            img: HDFC,
            paymentMethod: 'HDFC Bank Ltd',
            paymentDescription: 'Account no: ******6578',
            paymentMethodNet: t.cardNumber,
            disabled: false
          },
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
            paymentMethodNet: t.netBanking,
            disabled: true,
            dataTest: testIds.paymentpage_CashOnDelivery
          }
        ]}
      />
    </>
  )
}

export default PaymentMode
