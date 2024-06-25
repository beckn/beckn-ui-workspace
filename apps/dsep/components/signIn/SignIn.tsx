// 'use client'
import React, { useState } from 'react'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { useToast } from '@chakra-ui/react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import SkillUpLogo from '../../public/images/skillUpHomeLogo.svg'
import { useLanguage } from '../../hooks/useLanguage'
import { SignInPropsModel } from './Signin.types'
import { FormErrors, signInValidateForm } from '../../utilities/detailsForm-utils'
import { Toast } from '@beckn-ui/molecules'

const SignIn = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const toast = useToast()

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
      [name]: errors[name] || ''
    }))
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
        const email = data.user.email

        Cookies.set('authToken', token)
        Cookies.set('userEmail', email)
        Router.push('/homePage')
      } else {
        const errorData = await response.json()
        toast({
          render: ({ onClose }) => (
            <Toast
              status="error"
              title="Error!"
              description={errorData.error.message}
              onClose={onClose}
            />
          ),
          position: 'top',
          duration: 2000,
          isClosable: true
        })
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const isFormFilled = (): boolean => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }

  return (
    <BecknAuth
      schema={{
        logo: {
          src: SkillUpLogo,
          alt: 'skillup logo'
        },
        buttons: [
          {
            text: t.signIn,
            handleClick: handleSignIn,
            disabled: !isFormFilled(),
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
