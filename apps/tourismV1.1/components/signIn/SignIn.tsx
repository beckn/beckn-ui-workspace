import React, { useEffect, useMemo, useState } from 'react'
import Logo from '../../public/images/tourism-logo.svg'
import AlternateLogo from '../../public/images/tourism-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import { Box, useToast, Text, useBreakpoint } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@beckn-ui/common/src/services/User'
import { feedbackActions, FormErrors, signInValidateForm } from '@beckn-ui/common'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo
  const [login, { isLoading, isError, data, error }] = useLoginMutation()

  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: SignInPropsModel) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signInValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      login(signInData).unwrap()
    } catch (error) {
      console.error('An error occurred:', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: { message: t.toastError, display: true, type: 'error', description: t.toastMessage }
        })
      )
    }
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

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
            isLoading: isLoading
          },
          {
            text: t.signUp,
            handleClick: () => {
              Router.push('/signUp')
            },
            variant: 'outline',
            colorScheme: 'primary',
            disabled: isLoading
          }
        ],
        inputs: [
          {
            type: 'text',
            name: 'email',
            value: formData.email,
            handleChange: handleInputChange,
            label: t.email,
            error: formErrors.email
          },
          {
            type: 'password',
            name: 'password',
            value: formData.password,
            handleChange: handleInputChange,
            label: t.password,
            error: formErrors.password
          }
        ]
      }}
    />
  )
}

export default SignIn
