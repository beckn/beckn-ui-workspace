import React, { useMemo, useState } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Router from 'next/router'
import { FormErrors, SignUpFormProps } from '@beckn-ui/common/lib/types'
import { useTradeRegisterMutation } from '@services/UserService'
import AppLogo from '@public/images/ev_app_logo.svg'
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
    const signUpData = {
      fullname: formData.name,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      phone_no: formData.mobileNumber,
      utility_name: ''
    }

    if (isFormValid) {
      try {
        let registerResponse: any = null
        let catalogueSuccess: any = null

        registerResponse = await tradeRegister(signUpData)
        // for PRODUCER to create default catalogue
        catalogueSuccess = true // await createTradeCatalogue()

        console.log(registerResponse)
        if (!registerResponse || (registerResponse as { error: FetchBaseQueryError })?.error)
          throw new Error('Could not register')
        const jwtToken = registerResponse?.data?.data?.jwt
        if (jwtToken) {
          Cookies.set('authToken', jwtToken)
          console.log('JWT Token saved:', jwtToken)
        } else {
          throw new Error('JWT token not found in the response')
        }
        if (catalogueSuccess) {
          Router.push('/')
        }
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
      mt={'30px'}
      className="hideScroll"
      maxH="calc(100vh - 90px)"
      overflowY={'scroll'}
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
