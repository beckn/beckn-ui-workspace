import React, { useState } from 'react'
import Logo from '../../public/images/Logo.svg'
import AlternateLogo from '../../public/images/KuzaLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FormErrors, signInValidateForm } from '@utils/form-utils'
import { useBreakpoint } from '@chakra-ui/react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import api from '../../services/Users'

import { FaGoogle } from 'react-icons/fa'

import Router from 'next/router'
import { Box, useToast, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const toast = useToast()
  const breakpoint = useBreakpoint()
  // const [updatePost, result] = useSignInMutation()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo

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
        socialButtons: [
          {
            text: t.signInwithGoogle,
            handleClick: handleSignIn,
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary',
            leftIcon: <FaGoogle />,
            className: 'social_btn'
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

export const CustomToast: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <Box
    mt="2rem"
    p={4}
    bg="red.500"
    color="white"
    borderRadius="md"
    boxShadow="md"
  >
    <Text
      fontWeight={700}
      fontSize={'15px'}
      color={'white'}
      textAlign={'center'}
    >
      {title}
    </Text>
    <Text
      fontWeight={500}
      fontSize={'15px'}
      color={'white'}
      textAlign={'center'}
    >
      {message}
    </Text>
  </Box>
)
