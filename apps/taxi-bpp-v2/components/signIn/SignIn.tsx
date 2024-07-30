import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInFormProps } from '@beckn-ui/common/lib/types'
import { useLoginMutation } from '@beckn-ui/common/src/services/User'
import { signInValidateForm } from '@beckn-ui/common'
import TaxiBapLogo from '@public/images/taxi-bap-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'

const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [login, { isLoading }] = useLoginMutation()
  const { t } = useLanguage()

  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signInValidateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  // Check if form is filled
  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  // Handle sign-in action
  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      await login(signInData).unwrap()
      Router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
      // Handle error state or display error message
    }
  }

  return (
    <Box
      backgroundImage={"url('/images/ellipse.png')"}
      backgroundSize="cover"
      backgroundPosition={'center'}
      backgroundRepeat="no-repeat"
      color={'#fff'}
      padding="20px"
      mt={'80px'}
      h="calc(100vh - 80px)"
    >
      <Box>
        <BecknAuth
          schema={{
            logo: {
              src: TaxiBapLogo,
              alt: 'taxi bap logo'
            },
            buttons: [
              {
                text: t.signIn,
                handleClick: handleSignIn,
                disabled: !isFormFilled,
                variant: 'solid',
                colorScheme: 'primary',
                isLoading: isLoading,
                dataTest: 'login-button'
              }
            ],
            inputs: [
              {
                type: 'text',
                name: 'email',
                label: t.email,
                value: formData.email,
                handleChange: handleInputChange,
                error: formErrors.email,
                dataTest: 'input-email'
              },
              {
                type: 'password',
                name: 'password',
                label: t.password,
                value: formData.password,
                handleChange: handleInputChange,
                error: formErrors.password,
                dataTest: 'input-password'
              }
            ]
          }}
        />
      </Box>
    </Box>
  )
}

export default SignIn
