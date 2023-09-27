import { Box, Image, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import LoginIcon from '../public/images/LoginIcon.svg'
import style from '../components/detailsCard/ShippingForm.module.css'
import Button from '../components/button/Button'
import Router from 'next/router'

const MobileLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const sanitizedValue = value.replace(/\D/g, '')
    setPhoneNumber(sanitizedValue)
    setPhoneNumberError(validatePhoneNumber(sanitizedValue))
  }

  const validatePhoneNumber = (value: any) => {
    if (!value) {
      return 'errorNumber'
    }

    if (value.length !== 10) {
      return 'errorNumber3'
    }
    return ''
  }

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleFormSubmit = () => {
    localStorage.setItem('userPhone', phoneNumber)
    setPhoneNumber('')
    setPhoneNumberError('')
    Router.push('/mobileOtp')
  }

  const { t, locale } = useLanguage()

  return (
    <Box padding={'0 21px'}>
      <Box mt={'30px'}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={LoginIcon} />
      </Box>
      <Box mt={'60px'} mb={'37px'}>
        <div className={style.container}>
          <div className={style.did_floating_label_content}>
            <input
              className={`${style['did_floating_input']} {$style["otp_number_input"]}`}
              type="text"
              placeholder=" "
              name="mobileNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />

            {phoneNumberError && <span className={style.error}>{t[`${phoneNumberError}`]}</span>}

            <label className={`${style['did_floating_label']} ${style['otp_number']}`}>{t.formNumber}</label>
          </div>
        </div>
      </Box>

      <Button
        buttonText={t.sendOtpButton}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={phoneNumber.length === 0 || phoneNumberError.length !== 0}
        handleOnClick={handleFormSubmit}
      />
    </Box>
  )
}

export default MobileLogin
