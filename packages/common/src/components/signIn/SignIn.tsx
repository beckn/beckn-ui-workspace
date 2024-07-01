import React, { useState, useMemo } from 'react'
import { useBreakpoint } from '@chakra-ui/react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInComponentProps, SignInFormProps } from '@beckn-ui/common/lib/types'
import { useLoginMutation } from '@beckn-ui/common/src/services/User'
import { signInValidateForm } from '../../utils/form-utils'

const SignIn: React.FC<SignInComponentProps> = ({
  logos,
  onSignIn,
  onSignUp,
  initialFormData = { email: '', password: '' },
  t
}) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const breakpoint = useBreakpoint()
  const [login, { isLoading }] = useLoginMutation()

  // Determine current logo based on breakpoint
  const currentLogo = useMemo(() => {
    const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
    return mobileBreakpoints.includes(breakpoint) ? logos.mobile : logos.desktop
  }, [breakpoint, logos])

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
      [name]: t(`${errors[name as keyof FormErrors]}`) || ''
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
      onSignIn()
    } catch (error) {
      console.error('An error occurred:', error)
      // Handle error state or display error message
    }
  }

  return (
    <BecknAuth
      schema={{
        logo: {
          src: currentLogo.src,
          alt: currentLogo.alt
        },
        buttons: [
          {
            text: t('signIn'),
            handleClick: handleSignIn,
            disabled: !isFormFilled,
            variant: 'solid',
            colorScheme: 'primary',
            isLoading: isLoading,
            dataTest: 'login-button'
          },
          {
            text: t('signUp'),
            handleClick: onSignUp,
            variant: 'outline',
            colorScheme: 'primary',
            disabled: isLoading,
            dataTest: 'register-button'
          }
        ],
        inputs: [
          {
            type: 'text',
            name: 'email',
            label: t('email'),
            value: formData.email,
            handleChange: handleInputChange,
            error: formErrors.email,
            dataTest: 'input-email'
          },
          {
            type: 'password',
            name: 'password',
            label: t('password'),
            value: formData.password,
            handleChange: handleInputChange,
            error: formErrors.password,
            dataTest: 'input-password'
          }
        ]
      }}
    />
  )
}

export default SignIn
