import { Box, Image, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import LoginIcon from '../public/images/LoginIcon.svg'
import style from '../components/detailsCard/ShippingForm.module.css'
import Button from '../components/button/Button'
import Router from 'next/router'
import { Loader } from '@beckn-ui/molecules/src/components'
import { BecknLogin } from '@beckn-ui/becknified-components'

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
      <BecknLogin />
    </Box>
  )
}

export default MobileLogin
