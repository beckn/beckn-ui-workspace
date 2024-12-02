import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInFormProps } from '@beckn-ui/common/lib/types'
import { signInValidateForm } from '@beckn-ui/common'
import openSpark from '@public/images/openSparkLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import { useBapTradeLoginMutation, useBppTradeLoginMutation } from '@services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState, setRole } from '@store/auth-slice'
import { ROLE } from '@lib/config'

const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })

  const { role } = useSelector((state: AuthRootState) => state.auth)
  const [bapTradeLogin, { isLoading: bapLoading }] = useBapTradeLoginMutation()
  const [bppTradeLogin, { isLoading: bppLoading }] = useBppTradeLoginMutation()
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
      if (role === ROLE.CONSUMER) await bapTradeLogin(signInData).unwrap()
      if (role === ROLE.PRODUCER) await bppTradeLogin(signInData).unwrap()
      Router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  const handleOnRoleChange = (roleType: ROLE) => {
    dispatch(setRole({ role: roleType }))
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
              isLoading: bapLoading || bppLoading,
              dataTest: 'login-button'
            },
            {
              text: t.signUp,
              handleClick: handleSignUp,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: bapLoading || bppLoading,
              dataTest: 'register-button'
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
          ],
          socialButtons: [
            {
              text: role === ROLE.CONSUMER ? 'Sign In as Producer' : 'Sign In as Consumer',
              handleClick: () => handleOnRoleChange(role === ROLE.CONSUMER ? ROLE.PRODUCER : ROLE.CONSUMER),
              variant: 'outline',
              colorScheme: 'primary',
              dataTest: 'producer-button'
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignIn
