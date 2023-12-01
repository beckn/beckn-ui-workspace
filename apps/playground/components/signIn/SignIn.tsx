import React, { useState } from 'react'
import OpenCommerce from '../../public/images/openCommerce.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FormErrors, signInValidateForm } from '@utils/detailsForm-utils'
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

    //   const errors = signInValidateForm(updatedFormData) as any
    //   setFormErrors(prevErrors => ({
    //     ...prevErrors,
    //     [name]: errors[name] || ''
    //   }))
    //   setIsFormFilled(updatedFormData.email.trim() !== '' && updatedFormData.password.trim() !== '')
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
          src: OpenCommerce,
          alt: 'Open Commerce'
        },
        buttons: [
          {
            text: 'SignIn',
            handleClick: handleSignIn,
            disabled: !isFormFilled,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: 'SignUp',
            handleClick: () => {
              Router.push('/signUp')
            },
            disabled: !isFormFilled,
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
            label: 'Email'
          },
          {
            type: 'password',
            name: 'password',
            value: formData.password,
            handleChange: handleInputChange,
            label: 'Password'
          }
        ]
      }}
    />
  )
}

export default SignIn
