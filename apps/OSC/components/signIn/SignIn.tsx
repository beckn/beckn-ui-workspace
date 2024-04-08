import React, { useEffect, useState } from 'react'
import Logo from '../../public/images/Logo.svg'
import currentLogo from '../../public/images/OSC_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FormErrors, signInValidateForm } from '@utils/form-utils'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@services/Users'
import { BecknAuth } from '@beckn-ui/becknified-components'

import { FaGoogle } from 'react-icons/fa'

import Router from 'next/router'
import { Box, useToast, Text, useBreakpoint } from '@chakra-ui/react'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const breakpoint = useBreakpoint()
  // const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  // const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo
  const [login, { isLoading, isError, data, error }] = useLoginMutation()

  const toast = useToast()

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

  useEffect(() => {
    if (isError) {
      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message="Unable to login"
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }, [isError])

  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      login(signInData).unwrap()
    } catch (error) {
      console.error('An error occurred:', error)
      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message="Unable to login"
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }

  return (
    <Box mt="72px">
      <BecknAuth
        schema={{
          logo: {
            src: currentLogo,
            alt: 'OSC logo'
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
    </Box>
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
