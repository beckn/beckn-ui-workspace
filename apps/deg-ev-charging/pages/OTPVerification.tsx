import { feedbackActions } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Input } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useVerifyOtpMutation } from '@services/UserService'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'

const numberOfDigits = 6

const OTPVerification = () => {
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))
  const [, setOTPError] = useState<string | null>(null)
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([])

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const [verifyOtp] = useVerifyOtpMutation()

  useEffect(() => {}, [])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return
    const newArr = [...OTP]
    newArr[index] = value
    setOTP(newArr)

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleBackspaceAndEnter = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
      Cookies.set('isVerified', 'true')
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
        text={t.otpDescription}
        fontSize="12px"
        color="#80807F"
        style={{
          textAlign: 'start',
          marginTop: '16px'
        }}
      />
      <Flex
        flexDirection={'column'}
        justifyContent={'space-between'}
        height={'calc(100vh - 650px)'}
        gap={'20px'}
      >
        <Box mt={'25px'}>
          <Flex gap={'1rem'}>
            {OTP.map((digit, index) => (
              <Input
                key={index}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                onChange={e => handleChange(e.target.value, index)}
                onKeyUp={e => handleBackspaceAndEnter(e, index)}
                ref={el => (otpBoxReference.current[index] = el)}
                w="42px"
                h="46px"
                p="3"
                // margin={'0 6px'}
                background={'#D9D9D933 !important'}
                border="2px solid #0000001A"
                borderRadius="md"
                textAlign="center"
                fontSize="xl"
                _focus={{ borderColor: 'blue.400', borderWidth: '2px', outline: 'none' }}
              />
            ))}
          </Flex>
          <Flex
            justifyContent={'end'}
            marginTop={'1rem'}
          >
            <Typography
              text={'Didn’t receive OTP?'}
              color={'#80807F'}
            />
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
          text="Verify OTP"
          handleClick={handleVerifyOtp}
          // sx={{ marginTop: '60px' }}
          dataTest="otp_number"
        />
      </Flex>
    </Box>
  )
}

export default OTPVerification
