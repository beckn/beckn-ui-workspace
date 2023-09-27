import { Box, Text } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import style from '../components/detailsCard/ShippingForm.module.css'
import { useLanguage } from '../hooks/useLanguage'

const MobileOtp = () => {
  const [OTP, setOTP] = useState('')
  const [OTPError, setOTPError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const { t, locale } = useLanguage()

  const handleOTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const sanitizedValue = value.replace(/\D/g, '')
    setOTP(sanitizedValue)
    setOTPError(validateOTP(sanitizedValue))
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('userPhone')) {
      let str = localStorage.getItem('userPhone') as string
      const storedPhoneNumber = str.substring(str.length - 4)
      setPhoneNumber(storedPhoneNumber)
    }
  }, [])

  const validateOTP = (value: string) => {
    if (!value) {
      return 'errorOtp1'
    }

    if (value.length !== 6) {
      return 'errorOtp2'
    }

    return ''
  }

  const handleFormSubmit = () => {
    if (!OTP || OTP.length !== 6) {
      setOTPError(validateOTP(OTP))
      return
    }

    setOTP('')
    setOTPError('')
    Router.push('/homePage')
  }

  return (
    <>
      <Box padding={'0 21px'}>
        <Box mt={'20px'}>
          <Text fontSize={'30px'} fontWeight={'600'}>
            {t.verifyMobile}
          </Text>

          <Text pt={'10px'} fontSize={'15px'}>
            {t.otpMessage1} <br />
            {t.otpMessage2} {phoneNumber}
          </Text>
        </Box>

        <Box mt={'40px'}>
          <div className={style.container}>
            <div className={style.did_floating_label_content}>
              <input
                className={`${style['did_floating_input']} {$style["otp_number_input"]}`}
                type="text"
                placeholder=" "
                name="OTP"
                value={OTP}
                onChange={handleOTP}
              />

              {OTPError && <span className={style.error}>{t[`${OTPError}`]}</span>}

              <label className={`${style['did_floating_label']} ${style['otp_number']}`}>{t.otpPlaceholder}</label>
            </div>
          </div>
        </Box>

        <Button
          buttonText={t.loginButton}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={handleFormSubmit}
        />
      </Box>
    </>
  )
}

export default MobileOtp
