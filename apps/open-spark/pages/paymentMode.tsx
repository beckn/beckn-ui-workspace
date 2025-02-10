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
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import FormFieldInput from '@components/FormFieldInput/FormFieldInput'

function PaymentMode() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''

  const { t } = useLanguage()
  const router = useRouter()

  const [amount, setAmount] = useState('')
  const [formErrors, setFormErrors] = useState<{ name: string }>({
    name: ''
  })

  const validateForm = (data: any) => {
    if (!data.name || typeof data.name !== 'string') {
      return {}
    }
    if (data.name.trim() === '') {
      return {}
    } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(data.name.trim())) {
      return { name: 'errorAmount' }
    }
    return {}
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log(`handleInputChange`, e.target)
    setAmount(value)
    console.log(amount)

    const formData = {
      [name]: value
    }

    const errors: any = validateForm(formData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const depositFund = async () => {
    try {
      const response = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/add-fund`,
        {
          transactionAmount: amount
        },
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
          withCredentials: true
        }
      )
      router.push('/orderConfirmation')
    } catch (error) {
      console.error('Error fetching transactions data:', error)
    }
  }

  return (
    <>
      <FormFieldInput
        schema={[
          {
            type: 'number',
            name: 'amount',
            value: amount,
            handleChange: handleInputChange,
            label: 'Enter Amount',
            placeholder: '₹ 0',
            error: formErrors.name,
            dataTest: 'payment_inputAmount'
          }
        ]}
      />

      <PaymentMethodSelection
        t={key => t[key]}
        disableButton={[undefined, '', '0'].includes(amount)}
        handleOrderConfirmation={depositFund}
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
