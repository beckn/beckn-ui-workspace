import React, { useState, useEffect } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import AlternateLogo from '../../tourismV1.1/public/images/tourism-logo.svg'
import { SignUpPropsModel } from '@components/signIn/SignIn.types'
import { FormErrors, signUpValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import { Box, useBreakpoint, useToast } from '@chakra-ui/react'
import { useRegisterMutation } from '@services/Users'
import { CustomToast } from '@components/signIn/SignIn'
import Logo from '../../tourismV1.1/public/images/tourism-logo.svg'

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
        register({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobileNumber
        })
      } catch (error) {
        console.error('An error occurred:', error)
        toast({
          render: () => (
            <CustomToast
              title="Error!"
              message="Unable to register"
            />
          ),
          position: 'top',
          duration: 2000,
          isClosable: true
        })
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
              colorScheme: 'primary',
              isLoading: isLoading
            },
            {
              text: t.signIn,
              handleClick: () => {
                Router.push('/')
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
