import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Button, Flex, Input, useTheme } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useVerifyOtpMutation } from '@services/UserService'
import Router from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

interface VerifyOTPProps {
  description: string
  handleVerifyOtp: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const numberOfDigits = 6

const VerifyOTP = (props: VerifyOTPProps) => {
  const { description, handleVerifyOtp } = props
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))

  const otpBoxReference = useRef<any>([])
  const theme = useTheme()

  const color = theme.colors.primary[100]

  useEffect(() => {
    return () => {
      setOTP(new Array(numberOfDigits).fill(''))
    }
  }, [])

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

  const isDisabled = useMemo(() => {
    return OTP.every(value => value !== '')
  }, [OTP])
  return (
    <>
      <Flex
        flexDirection={'column'}
        justifyContent={'space-between'}
        padding={{ base: '0', md: '0', lg: '0 8rem' }}
      >
        <Typography
          text={description}
          fontSize="12px"
          color="#80807F"
          style={{
            marginTop: '16px',
            textAlign: 'left'
          }}
        />
        <Box
          mt={'25px'}
          alignSelf="center"
        >
          <Flex
            gap="0.5rem"
            justifyContent={'space-between'}
          >
            {OTP.map((digit, index) => (
              <Input
                key={index}
                value={digit}
                maxLength={1}
                onChange={e => handleChange(e.target.value, index)}
                onKeyUp={e => handleBackspaceAndEnter(e, index)}
                ref={el => (otpBoxReference.current[index] = el)}
                w="12%"
                h="46px"
                p="3"
                border="1px solid"
                borderColor="#0000001A"
                borderRadius="md"
                textAlign="center"
                fontSize="xl"
                backgroundColor={'#D9D9D933'}
                _focus={{ borderColor: 'blue.400', borderWidth: '2px', outline: 'none' }}
              />
            ))}
          </Flex>
          <Flex
            justifyContent={'end'}
            marginTop={'1.5rem'}
          >
            <Typography
              text={'Didn’t receive OTP?'}
              color="#80807F"
            />
            <Typography
              text={'Resend'}
              color={color}
              sx={{
                marginLeft: '5px',
                cursor: 'pointer',
                _hover: { textDecoration: 'underline' }
              }}
            />
          </Flex>
        </Box>
        <BecknButton
          text="Verify"
          disabled={!isDisabled}
          handleClick={e => handleVerifyOtp(e)}
          sx={{ marginTop: '2rem' }}
          dataTest="otp_number"
        />
      </Flex>
    </>
  )
}

export default VerifyOTP
