// 'use client'
import React, { useState } from 'react'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { Box, Flex, useToast } from '@chakra-ui/react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { useLanguage } from '../../hooks/useLanguage'
import { SignInPropsModel } from './Signin.types'
import Styles from './SignIn.module.css'
import { FormErrors, signInValidateForm } from '../../utilities/detailsForm-utils'
import CustomToast from '../customToast/custom-toast'
import { Typography } from '@beckn-ui/molecules'

const SignIn = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
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
        const email = data.user.email

        Cookies.set('authToken', token)
        Cookies.set('userEmail', email)
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
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundImage={"url('/images/ellipse.png')"}
      backgroundSize="cover"
      backgroundPosition={'center'}
      backgroundRepeat="no-repeat"
    >
      <Box
        width="100vw"
        p="10%"
      >
        <Typography
          text={t.loginHeaderText}
          fontSize={'24px'}
          fontFamily="poppins"
          fontWeight="600"
          color="#fff"
        />
        <Box className={Styles.signin_container}>
          <BecknAuth
            schema={{
              buttons: [
                {
                  text: t.signIn,
                  handleClick: handleSignIn,
                  disabled: !isFormFilled,
                  variant: 'solid',
                  colorScheme: 'primary'
                }
              ],
              inputs: [
                {
                  type: 'text',
                  name: 'email',
                  placeholder: t.emailPlaceholder,
                  value: formData.email,
                  handleChange: handleInputChange,
                  label: t.email,
                  error: formErrors.email,
                  variant: 'outline'
                },
                {
                  type: 'password',
                  name: 'password',
                  placeholder: t.passwordPlaceholder,
                  value: formData.password,
                  handleChange: handleInputChange,
                  label: t.password,
                  error: formErrors.password,
                  variant: 'outline'
                }
              ],
              forgotPassword: {
                text: t.forgotPassword,
                color: '#ABD4FA',
                fontWeight: '500'
              }
            }}
          />
        </Box>
        <Flex
          width={'42%'}
          mb="20px"
          fontFamily="poppins"
          fontWeight={'500'}
          fontSize={'14px'}
          justifyContent="space-between"
          color={'#fff'}
        >
          {'New User?'}
          <Typography
            text={t.signUpText}
            color={'#ABD4FA'}
            fontFamily="poppins"
            fontWeight={'500'}
            fontSize={'14px'}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

export default SignIn
