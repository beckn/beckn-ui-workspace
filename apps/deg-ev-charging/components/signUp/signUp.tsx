import React, { useMemo, useState } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { FormErrors, SignUpFormProps } from '@beckn-ui/common/lib/types'
import { useTradeRegisterMutation, type RegisterRequest } from '@services/UserService'
import AppLogo from '@public/images/deg-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { CustomFormErrorProps, signUpValidateForm } from '@utils/form-utils'
import Cookies from 'js-cookie'

interface RegisterFormProps extends SignUpFormProps {
  utilityCompany?: string
  address: string
}

const SignUp = () => {
  const [formData, setFormData] = useState<RegisterFormProps>({
    name: '',
    email: '',
    password: 'Test@123',
    mobileNumber: '',
    address: ''
  })
  const [formErrors, setFormErrors] = useState<CustomFormErrorProps>({
    name: '',
    email: '',
    password: '',
    address: '',
    mobileNumber: ''
  })

  const [tradeRegister, { isLoading }] = useTradeRegisterMutation()
  const { t } = useLanguage()

  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    const { name, value } = e.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signUpValidateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  // Handle sign-up action
  const handleSignUp = async () => {
    const errors = signUpValidateForm(formData)
    const isFormValid = Object.values(errors).every(error => error === '')
    const signUpData: RegisterRequest = {
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      password: formData.password,
      phoneNumber: formData.mobileNumber.trim(),
      utility_name: ''
    }

    if (isFormValid) {
      try {
        const registerResponse = await tradeRegister(signUpData).unwrap()
        const jwtToken = registerResponse?.jwt
        if (jwtToken) {
          Cookies.set('authToken', jwtToken)
        }
        Router.push('/')
      } catch (error) {
        console.error('An error occurred:', error)
      }
    } else {
      setFormErrors({
        ...formErrors,
        name: t[errors.name!] || ''
      })
    }
  }

  // Check if form is filled
  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const handleSignIn = () => {
    Router.push('/signIn')
  }

  return (
    <Box
      className="ev-auth-page hideScroll"
      w="100%"
      maxW="28rem"
      mx="auto"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
      maxH="calc(100vh - 90px)"
      overflowY="auto"
      minH="0"
    >
      <BecknAuth
        schema={{
          logo: {
            src: AppLogo,
            alt: 'app-logo'
          },
          buttons: [
            {
              text: t.signUp,
              handleClick: handleSignUp,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: isLoading
            },
            {
              text: t.signIn,
              handleClick: handleSignIn,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'name',
              variant: 'rounded',
              value: formData.name,
              handleChange: handleInputChange,
              label: t.name,
              error: formErrors.name
            },
            {
              type: 'number',
              name: 'mobileNumber',
              variant: 'rounded',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            },
            {
              type: 'text',
              name: 'email',
              variant: 'rounded',
              value: formData.email,
              handleChange: handleInputChange,
              label: t.enterEmailID,
              error: formErrors.email
            },
            {
              type: 'text',
              name: 'address',
              variant: 'rounded',
              value: formData.address,
              handleChange: handleInputChange,
              label: t.enterAddrees,
              error: formErrors.address
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignUp
