import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { PaymentMethodSelection } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import SBI from '@public/images/sbi.svg'
import HDFC from '@public/images/hdfc.svg'
import { Box, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import BottomModal from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import useOtpTimer from '@hooks/useOtpTimer'

function Withdraw() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    withdrawFund()
  }

  return (
    <>
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
              borderColor: '#3182ce',
              boxShadow: '0 0 0 1px #3182ce'
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
            <FormControl mb="4rem">
              <FormLabel
                fontWeight={'400'}
                fontSize={'12px'}
              >{`Enter Verification OTP (${otpTime})`}</FormLabel>
              <Input
                type="number"
                name="otp_verification"
                placeholder=""
                sx={{
                  fontSize: '12px',
                  _focusVisible: {
                    zIndex: 0,
                    borderColor: '#3182ce',
                    boxShadow: '0 0 0 1px #3182ce'
                  }
                }}
                value={OTP}
                onChange={e => {
                  setOTP(e.target.value || '')
                }}
              />
            </FormControl>

            <BecknButton
              text="Verify"
              handleClick={handleSubmit}
            />
          </Box>
        )}
      </BottomModal>
    </>
  )
}

export default Withdraw
