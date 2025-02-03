import { feedbackActions } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Button, Flex, Input } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useVerifyOtpMutation } from '@services/UserService'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import style from '../components/signIn/otp.module.css'

const correctOTP = '123456'
const numberOfDigits = 6

const OTPVerification = () => {
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))
  const [OTPError, setOTPError] = useState<string | null>(null)
  const otpBoxReference = useRef<any>([])

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()

  useEffect(() => {}, [])

  const handleChange = (value: any, index: any) => {
    let newArr = [...OTP]
    newArr[index] = value
    setOTP(newArr)

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleBackspaceAndEnter = (e: any, index: any) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus()
    }
    if (e.key === 'Enter' && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

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
      const response = await verifyOtp(data).unwrap()
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: t.success,
            display: true,
            type: 'success',
            description: response.data.message
          }
        })
      )
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
      <Typography
        text="One Time Password"
        fontSize="20px"
        fontWeight="500"
      />
      <Typography
        text={'Please enter the 6 digit OTP received from your utility provider'}
        fontSize="12px"
        color="#5F5F5F"
        style={{
          marginTop: '16px'
        }}
      />
      <Flex
        flexDirection={'column'}
        justifyContent={'space-between'}
        height={'calc(100vh - 190px)'}
      >
        <Box mt={'25px'}>
          {OTP.map((digit, index) => (
            <Input
              key={index}
              value={digit}
              maxLength={1}
              onChange={e => handleChange(e.target.value, index)}
              onKeyUp={e => handleBackspaceAndEnter(e, index)}
              ref={el => (otpBoxReference.current[index] = el)}
              w="42px"
              h="46px"
              p="3"
              margin={'0 6px'}
              border="1px solid"
              borderColor="gray.500"
              borderRadius="md"
              textAlign="center"
              fontSize="xl"
              _focus={{ borderColor: 'blue.400', borderWidth: '2px', outline: 'none' }}
            />
          ))}
          <Flex
            justifyContent={'center'}
            marginTop={'1rem'}
          >
            <Typography text={'Didn’t receive OTP?'} />
            <Typography
              text={'Resend OTP'}
              color={'#4498E8'}
              sx={{
                marginLeft: '5px',
                cursor: 'pointer',
                _hover: { textDecoration: 'underline' }
              }}
            />
          </Flex>
        </Box>
        <BecknButton
          text="Submit"
          handleClick={handleVerifyOtp}
          // sx={{ marginTop: '60px' }}
          dataTest="otp_number"
        />
      </Flex>
    </Box>
  )
}

export default OTPVerification
