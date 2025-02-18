import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInFormProps } from '@beckn-ui/common/lib/types'
import { signInValidateForm } from '@beckn-ui/common'
import lendEase from '@public/images/lend-ease-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { useTradeLoginMutation } from '@services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import { ROLE } from '@lib/config'

const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })

  const [tradeLogin, { isLoading }] = useTradeLoginMutation()
  const { t } = useLanguage()
  const dispatch = useDispatch()

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

    const errors = signInValidateForm(updatedFormData)
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
      email: formData.email,
      password: formData.password
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
            src: lendEase,
            alt: 'lendEase-logo'
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
              name: 'email',
              label: t.enterEmailID,
              value: formData.email,
              handleChange: handleInputChange,
              error: formErrors.email,
              dataTest: 'input-email'
            },
            {
              type: 'password',
              name: 'password',
              label: t.enterPassword,
              value: formData.password,
              handleChange: handleInputChange,
              error: formErrors.password,
              dataTest: 'input-password'
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignIn
