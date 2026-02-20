import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import AppLogo from '@public/images/deg-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { useTradeLoginMutation } from '@services/UserService'
import { signInValidateForm } from '@utils/form-utils'
import type { FormErrors } from '@beckn-ui/common/lib/types'

export interface SignInFormProps {
  email: string
  password: string
}

// eslint-disable-next-line react/prop-types
const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })

  const [tradeLogin, { isLoading }] = useTradeLoginMutation()
  const { t } = useLanguage()

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

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const handleSignIn = async () => {
    const signInData = {
      email: formData.email.trim(),
      password: formData.password
    }
    try {
      await tradeLogin(signInData).unwrap()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
  const handleSignUp = () => {
    Router.push('/signUp')
  }
  return (
    <Box
      className="ev-auth-page"
      w="100%"
      maxW="28rem"
      mx="auto"
      px={{ base: 4, sm: 6 }}
      py={{ base: 6, sm: 8 }}
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
              text: t.signIn,
              handleClick: handleSignIn,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: isLoading,
              dataTest: 'login-button'
            },
            {
              text: t.signUp,
              handleClick: handleSignUp,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading,
              dataTest: 'register-button'
            }
          ],
          inputs: [
            {
              type: 'email',
              name: 'email',
              variant: 'rounded',
              label: t.enterEmailID,
              value: formData.email,
              handleChange: handleInputChange,
              error: formErrors.email,
              dataTest: 'input-email'
            },
            {
              type: 'password',
              name: 'password',
              variant: 'rounded',
              label: t.enterPassword,
              value: formData.password,
              handleChange: handleInputChange,
              error: formErrors.password,
              dataTest: 'input-password'
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignIn
