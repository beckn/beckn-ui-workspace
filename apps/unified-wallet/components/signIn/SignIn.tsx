import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors } from '@beckn-ui/common/lib/types'
import AppLogo from '@public/images/wallet_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import { useLoginMutation } from '@services/UserService'
import { useDispatch } from 'react-redux'
import { LoginFormProps } from '@lib/types/user'
import { useRouter } from 'next/router'
import { mobilePhoneValidate } from '@utils/form-utils'

const SignIn = ({ initialFormData = { mobileNumber: '+91 ' } }) => {
  const [formData, setFormData] = useState<LoginFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ mobileNumber: '' })

  const [login, { isLoading }] = useLoginMutation()
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    if (!value.startsWith('+91 ')) {
      value = '+91 '
    }

    // Prevent clearing the field
    if (value.length < 4) {
      value = '+91 '
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = mobilePhoneValidate(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const handleSignIn = async () => {
    const signInData = {
      mobileNumber: formData.mobileNumber.replace(/^(\+91\s?)/, '')
    }

    try {
      // await login(signInData).unwrap()
      router.push('/OTPVerification')
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <Box>
      <BecknAuth
        schema={{
          logo: {
            src: AppLogo,
            alt: 'wallet-logo'
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
