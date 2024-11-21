import React, { useMemo, useState } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box, useBreakpoint } from '@chakra-ui/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Router from 'next/router'
import { FormErrors, SignInResponse, SignUpComponentProps, SignUpFormProps } from '@beckn-ui/common/lib/types'
import { useRegisterMutation } from '../../services/User'
import { signUpValidateForm } from '../../utils/form-utils'

const SignUp: React.FC<SignUpComponentProps> = ({
  baseUrl,
  logos,
  onSignIn,
  onSignUp,
  initialFormData = { name: '', email: '', password: '', mobileNumber: '' },
  t
}) => {
  const [formData, setFormData] = useState<SignUpFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    email: '',
    password: '',
    mobileNumber: ''
  })

  const breakpoint = useBreakpoint()
  const [register, { isLoading }] = useRegisterMutation()

  // Determine current logo based on breakpoint
  const currentLogo = useMemo(() => {
    const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
    return mobileBreakpoints.includes(breakpoint) ? logos.mobile : logos.desktop
  }, [breakpoint, logos])

  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signUpValidateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t(`${errors[name as keyof FormErrors]}`) || ''
    }))
  }

  // Handle sign-up action
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

        if ((registerResponse as { error: FetchBaseQueryError })?.error) throw new Error('Could not register')

        const myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${(registerResponse as { data: SignInResponse }).data.jwt}`)

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
          Router.push('/')
          onSignUp()
          return response.json()
        })
      } catch (error) {
        console.error('An error occurred:', error)
      }
    } else {
      setFormErrors({
        ...formErrors,
        name: t(errors.name!) || ''
      })
    }
  }

  // Check if form is filled
  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

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
            src: currentLogo.src,
            alt: currentLogo.alt, //'Suppliflow logo'
            description: currentLogo?.description || ''
          },
          buttons: [
            {
              text: t('signUp'),
              handleClick: handleSignUp,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: isLoading
            },
            {
              text: t('signIn'),
              handleClick: onSignIn,
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
              label: t('fullName'),
              error: formErrors.name
            },
            {
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: handleInputChange,
              label: t('enterEmailID'),
              error: formErrors.email
            },
            {
              type: 'password',
              name: 'password',
              value: formData.password,
              handleChange: handleInputChange,
              label: t('enterPassword'),
              error: formErrors.password
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t('enterMobileNumber'),
              error: formErrors.mobileNumber
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignUp
