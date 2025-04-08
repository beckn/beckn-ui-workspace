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
import { Box, FormControl, FormErrorMessage, FormLabel, Input, useTheme } from '@chakra-ui/react'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import VerifyOTP from '@components/VerifyOTP/VerifyOTP'
import BottomModal from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'

function PaymentMode() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''

  const [amount, setAmount] = useState('')
  const [formErrors, setFormErrors] = useState<{ name: string }>({
    name: ''
  })
  const [verifyModal, setVerifyModal] = useState(false)
  const [OTP, setOTP] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const router = useRouter()
  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

  const validateForm = (data: any) => {
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
    <Box>
      <FormControl
        mb="0.5rem"
        isInvalid={!!formErrors.name}
      >
        <FormLabel>Enter Amount</FormLabel>
        <Input
          type="number"
          name="name"
          placeholder="₹ 0"
          sx={{
            _focusVisible: {
              zIndex: 0,
              borderColor: primaryColor,
              boxShadow: `0 0 0 1px ${primaryColor}`
            }
          }}
          value={amount}
          onChange={handleInputChange}
        />
        {formErrors.name && (
          <FormErrorMessage
            position={'absolute'}
            mt="0px"
          >
            {formErrors.name}
          </FormErrorMessage>
        )}
      </FormControl>
      <PaymentMethodSelection
        t={key => t[key]}
        disableButton={[undefined, '', '0'].includes(amount)}
        handleOrderConfirmation={() => setVerifyModal(true)}
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
      <BottomModal
        isOpen={verifyModal}
        onClose={() => {
          setVerifyModal(false)
        }}
        modalHeader="OTP Verification"
        isLoading={isLoading}
      >
        {isLoading ? (
          <Box
            display="grid"
            height="100%"
            alignContent="center"
            padding={'2rem 0'}
            data-test={testIds.loadingIndicator}
          >
            <LoaderWithMessage
              loadingText="Please Wait"
              loadingSubText="While we process your payment"
            />
          </Box>
        ) : (
          <Box p="0 24px">
            <VerifyOTP
              description="Enter the one time password the we have just sent to your registered mobile number."
              handleVerifyOtp={depositFund}
            />
          </Box>
        )}
      </BottomModal>
    </Box>
  )
}

export default PaymentMode
