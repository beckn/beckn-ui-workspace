import React, { useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import AlternateLogo from '../public/images/KuzaLogo.svg'
import { SignUpPropsModel } from '@components/signIn/SignIn.types'
import { FormErrors, signUpValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { Box, useBreakpoint, useToast } from '@chakra-ui/react'
import { CustomToast } from '@components/signIn/SignIn'
import Logo from '@public/images/Logo.svg'

const SignUp = () => {
  const { t } = useLanguage()
  const toast = useToast()
  const [formData, setFormData] = useState<SignUpPropsModel>({ name: '', email: '', password: '', mobileNumber: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', email: '', password: '', mobileNumber: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: SignUpPropsModel) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signUpValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
    setIsFormFilled(
      updatedFormData.name.trim() !== '' &&
        updatedFormData.email.trim() !== '' &&
        updatedFormData.password.trim() !== '' &&
        updatedFormData.mobileNumber.trim() !== ''
    )
  }

  const handleSignUp = async () => {
    const errors = signUpValidateForm(formData)
    const isFormValid = Object.values(errors).every(error => error === '')

    if (isFormValid) {
      const registrationData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobileNumber
      }

      try {
        const response = await fetch(`${baseUrl}/auth/local/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        })

        if (response.ok) {
          const data = await response.json()
          const token = data.jwt

          Cookies.set('authToken', token)
          Router.push('/homePage')
        } else {
          const errorData = await response.json()
          toast({
            render: () => (
              <CustomToast
                title="Error!"
                message={errorData.error.message}
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
    } else {
      setFormErrors({
        ...formErrors,
        name: t[`${errors.name}`] || ''
      })
    }
  }

  return (
    <Box mt={'30px'}>
      <BecknAuth
        schema={{
          logo: {
            src: currentLogo,
            alt: 'Suppliflow logo'
          },
          buttons: [
            {
              text: t.signUp,
              handleClick: handleSignUp,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary'
            },
            {
              text: t.signIn,
              handleClick: () => {
                Router.push('/')
              },
              disabled: false,
              variant: 'outline',
              colorScheme: 'primary'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'name',
              value: formData.name,
              handleChange: handleInputChange,
              label: t.fullName,
              error: formErrors.name
            },
            {
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: handleInputChange,
              label: t.enterEmailID,
              error: formErrors.email
            },
            {
              type: 'password',
              name: 'password',
              value: formData.password,
              handleChange: handleInputChange,
              label: t.enterPassword,
              error: formErrors.password
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignUp
