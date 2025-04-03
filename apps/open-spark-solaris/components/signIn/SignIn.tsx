import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { signInValidateForm } from '@beckn-ui/common'
import openSpark from '@public/images/rental_app_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { useTradeLoginMutation } from '@services/UserService'
import { useDispatch } from 'react-redux'
import { mobilePhoneValidate } from '@utils/form-utils'

export interface SignInFormProps {
  mobileNumber: string
}
interface FormErrors {
  mobileNumber: string
}

interface SignInProps {
  initialFormData?: SignInFormProps
}

const SignIn = ({ initialFormData = { mobileNumber: '' } }: SignInProps) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ mobileNumber: '' })

  const [tradeLogin, { isLoading }] = useTradeLoginMutation()
  const { t } = useLanguage()
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    // if (!value.startsWith('+91 ')) {
    //   value = '+91 '
    // }

    // // Prevent clearing the field
    // if (value.length < 4) {
    //   value = '+91 '
    // }
    const numericPart = value //.replace(/\D/g, '').slice(2)

    value = `${numericPart}`

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = mobilePhoneValidate(updatedFormData, false)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    return (
      // Object.values(formData).every(value => value !== '+91 ') &&
      Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const handleSignIn = async () => {
    const signInData = {
      phone: formData.mobileNumber //.replace('+91 ', '')
    }

    try {
      await tradeLogin(signInData).unwrap()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  return (
    <Box>
      <BecknAuth
        schema={{
          logo: {
            src: openSpark,
            alt: 'openSpark-logo'
          },
          buttons: [
            {
              text: t.signIn,
              handleClick: handleSignIn,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: isLoading,
              dataTest: 'login-button'
            },
            {
              text: t.signUp,
              handleClick: handleSignUp,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading,
              dataTest: 'register-button'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'mobileNumber',
              label: t.enterMobileNumber,
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              error: formErrors.mobileNumber,
              dataTest: 'input-mobile-number'
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignIn
