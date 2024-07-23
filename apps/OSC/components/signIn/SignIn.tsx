import React, { useMemo, useState } from 'react'
import currentLogo from '../../public/images/OSC_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { useDispatch } from 'react-redux'
import { BecknAuth } from '@beckn-ui/becknified-components'

import Router from 'next/router'

import { useLoginMutation } from '@beckn-ui/common/src/services/User'
import { FormErrors, signInValidateForm } from '@beckn-ui/common'
import { feedbackActions } from '@beckn-ui/common'

const SignIn = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [login, { isLoading }] = useLoginMutation()

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
  const isFormFilled = useMemo(() => {
    return () => {
      return (
        Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
      )
    }
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

      dispatch(
        feedbackActions.setToastData({
          toastData: { message: t.error, display: true, type: 'error', description: t.unableToLogin }
        })
      )
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
            disabled: !isFormFilled(),
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
