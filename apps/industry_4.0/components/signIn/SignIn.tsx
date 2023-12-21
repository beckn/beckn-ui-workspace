import React, { useState } from 'react'
import Suppliflow_logo from '../../public/images/Suppliflow_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FormErrors, signInValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(true)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

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
    setIsFormFilled(updatedFormData.email.trim() !== '' && updatedFormData.password.trim() !== '')
  }

  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      const response = await fetch(`${baseUrl}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.jwt

        localStorage.setItem('token', token)
        Router.push('/homePage')
      } else {
        console.error('Sign In failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <BecknAuth
      schema={{
        logo: {
          src: Suppliflow_logo,
          alt: 'Suppliflow logo'
        },
        buttons: [
          {
            text: t.signIn,
            handleClick: handleSignIn,
            disabled: !isFormFilled,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: t.signUp,
            handleClick: () => {
              Router.push('/signUp')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary'
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
