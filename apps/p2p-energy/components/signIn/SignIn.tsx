import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInFormProps } from '@beckn-ui/common/lib/types'
import { signInValidateForm } from '@beckn-ui/common'
import energyIcon from '@public/images/flash.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { useConsumerLoginMutation } from '@services/UserService'

const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [consumerLogin, { isLoading }] = useConsumerLoginMutation()
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
      email: formData.email,
      password: formData.password
    }

    try {
      await consumerLogin(signInData).unwrap()
      Router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
      // Handle error state or display error message
    }
  }

  return (
    <Box>
      <BecknAuth
        schema={{
          logo: {
            src: energyIcon,
            alt: 'open_spark'
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
              label: t.enterEmailID,
              value: formData.email,
              handleChange: handleInputChange,
              error: formErrors.email,
              dataTest: 'input-email'
            },
            {
              type: 'password',
              name: 'password',
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
