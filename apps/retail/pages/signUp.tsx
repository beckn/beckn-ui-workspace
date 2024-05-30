import React, { useState, useEffect } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import AlternateLogo from '../public/images/KuzaLogo.svg'
import { SignUpPropsModel } from '@components/signIn/SignIn.types'
import { FormErrors, signUpValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { Box, useBreakpoint, useToast, Text } from '@chakra-ui/react'
import { useRegisterMutation } from '@services/Users'
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
  const [register, { isLoading, isError }] = useRegisterMutation()

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    if (isError) {
      toast({
        render: () => (
          <CustomToast
            title={t.error}
            message={t.signupErrorMessage}
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }, [isError])

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
      try {
        const registerResponse = await register({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobileNumber
        })

        if (registerResponse?.error) throw new Error('Could not register')

        const myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${registerResponse.data.jwt}`)

        const currentFormData = new FormData()
        const data = {
          name: formData.name,
          phone: formData.mobileNumber
        }

        currentFormData.append('data', JSON.stringify(data))

        const requestOptions: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
          body: currentFormData
        }

        fetch(`${baseUrl}/profiles`, requestOptions).then(response => {
          // reactToastifyToast.success('Profile updated successfully!')
          Router.push('/')
          return response.json()
        })
      } catch (error) {
        console.error('An error occurred:', error)
        // toast({
        //   render: () => (
        //     <CustomToast
        //       title={t.error}
        //       message={t.unableToRegister}
        //     />
        //   ),
        //   position: 'top',
        //   duration: 2000,
        //   isClosable: true
        // })
      }
    } else {
      setFormErrors({
        ...formErrors,
        name: t[`${errors.name}`] || ''
      })
    }
  }

  return (
    <Box
      mt={'30px'}
      className="hideScroll"
      maxH="calc(100vh - 90px)"
      overflowY={'scroll'}
    >
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
              colorScheme: 'primary',
              isLoading: isLoading
            },
            {
              text: t.signIn,
              handleClick: () => {
                Router.push('/signin')
              },
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading
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
