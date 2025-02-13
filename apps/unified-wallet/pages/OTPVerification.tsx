import { Box } from '@chakra-ui/react'
import VerifyOTP from '@components/VerifyOTP/VerifyOTP'
import { useLanguage } from '@hooks/useLanguage'
import { useVerifyOtpMutation } from '@services/UserService'
import Cookies from 'js-cookie'
import Router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

const correctOTP = '123456'
const numberOfDigits = 6

const OTPVerification = () => {
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))
  const [OTPError, setOTPError] = useState<string | null>(null)

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()

  // useEffect(() => {
  //   if (OTP.join('') !== '' && OTP.join('') !== correctOTP) {
  //     setOTPError('❌ Wrong OTP Please Check Again')
  //   } else {
  //     setOTPError(null)
  //   }
  // }, [OTP])

  const handleVerifyOtp = async () => {
    const data = {
      otp: Number(OTP.join(''))
    }

    try {
      Cookies.set('isVerified', 'true')
      Router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      justifyItems={'center'}
      textAlign="center"
      marginTop={{ base: '10px', md: '60px', lg: '20px' }}
    >
      <VerifyOTP
        description="Enter the one time password the we have just sent to your mobile number"
        handleVerifyOtp={handleVerifyOtp}
      />
    </Box>
  )
}

export default OTPVerification
