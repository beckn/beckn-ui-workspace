import React, { useMemo, useState } from 'react'
import Logo from '../../public/images/Logo.svg'
import AlternateLogo from '../../public/images/KuzaLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { signInValidateForm } from '@beckn-ui/common/src/utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import { Box, Text, useBreakpoint } from '@chakra-ui/react'
import { FormErrors, SignInProps } from '@beckn-ui/common/lib/types'
import { useLoginMutation } from '@beckn-ui/common/src/services/User'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInProps>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const breakpoint = useBreakpoint()
  const [login, { isLoading, isError, data, error }] = useLoginMutation()

  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: SignInProps) => ({
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
      identifier: formData.email,
      password: formData.password
    }

    try {
      login(signInData).unwrap()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <BecknAuth
      schema={{
        logo: {
          src: currentLogo,
          alt: 'Kuza logo'
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
            handleClick: () => {
              Router.push('/signUp')
            },
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
            value: formData.email,
            handleChange: handleInputChange,
            label: t.email,
            error: formErrors.email,
            dataTest: 'input-email'
          },
          {
            type: 'password',
            name: 'password',
            value: formData.password,
            handleChange: handleInputChange,
            label: t.password,
            error: formErrors.password,
            dataTest: 'input-password'
          }
        ]
      }}
    />
  )
}

export default SignIn
