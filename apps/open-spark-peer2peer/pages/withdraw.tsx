import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import SBI from '@public/images/sbi.svg'
import HDFC from '@public/images/hdfc.svg'
import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import BottomModal from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import useOtpTimer from '@hooks/useOtpTimer'
import FormFieldInput from '@components/FormFieldInput/FormFieldInput'

function Withdraw() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('p2pAuthToken') || ''

  const { t } = useLanguage()
  const router = useRouter()
  const otpTime = useOtpTimer()

  const [amount, setAmount] = useState('')
  const [formErrors, setFormErrors] = useState<{ name: string }>({
    name: ''
  })
  const [verifyModal, setVerifyModal] = useState(false)
  const [OTP, setOTP] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

    const formData = {
      [name]: value
    }

    const errors: any = validateForm(formData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const withdrawFund = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/withdraw-fund`,
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
    } finally {
      setIsLoading(false)
    }
  }
  const handleOppChange = (e: any) => {
    setOTP(e.target.value || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    withdrawFund()
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
            dataTest: 'wallet_inputAmount'
          }
        ]}
      />
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
          }
        ]}
      />
      <BottomModal
        isOpen={verifyModal}
        onClose={() => {
          setVerifyModal(false)
        }}
        modalHeader="Verify Transaction"
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
            <FormFieldInput
              schema={[
                {
                  type: 'number',
                  name: 'otp_verification',
                  value: OTP,
                  handleChange: handleOppChange,
                  label: `Enter Verification OTP (${otpTime})`,
                  placeholder: '',
                  error: formErrors.name,
                  dataTest: 'otp_inputNumber'
                }
              ]}
            />
            <Flex
              justifyContent={'flex-end'}
              alignItems={'end'}
            >
              <Text
                fontSize={'10px'}
                fontWeight={400}
              >
                Didn’t receive OTP? <span style={{ color: '#4498E8', cursor: 'pointer' }}>Resend OTP</span>{' '}
              </Text>
            </Flex>

            <BecknButton
              text="Verify"
              handleClick={handleSubmit}
              sx={{ mt: '60px' }}
            />
          </Box>
        )}
      </BottomModal>
    </>
  )
}

export default Withdraw
