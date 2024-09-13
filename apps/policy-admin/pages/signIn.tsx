import React, { useState, useMemo } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, SignInFormProps } from '@beckn-ui/common/lib/types'
import { FeedbackRootState, signInValidateForm } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { Box, Input, FormControl, Text, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { usePolicyLoginMutation, useResetLinkMutation } from '@services/UserService'
import PortalIcon from '@public/images/online-taxi-booking.svg'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { useSelector } from 'react-redux'
import { Toast } from '@beckn-ui/molecules'
import { BottomModal } from '@beckn-ui/molecules'

const SignIn = ({ initialFormData = { email: '', password: '' } }) => {
  const [formData, setFormData] = useState<SignInFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [policyLogin, { isLoading }] = usePolicyLoginMutation()
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState('')
  const [resetLink, { isLoading: isResetLinkLoading }] = useResetLinkMutation()
  const toast = useToast()
  const {
    toast: { display, message, type, description }
  } = useSelector((state: FeedbackRootState) => state.feedback)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)

  const { t } = useLanguage()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

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

  const handleForgotPasswordEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setForgotPasswordEmail(email)
    if (email && !validateEmail(email)) {
      setForgotPasswordEmailError('Please enter a valid email address')
    } else {
      setForgotPasswordEmailError('')
    }
  }

  // Check if form is filled
  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  // Handle sign-in action
  const handleSignIn = async () => {
    const signInData = {
      email: formData.email,
      password: formData.password
    }

    try {
      await policyLogin(signInData).unwrap()
      router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
      // Handle error state or display error message
    }
  }

  const handleMenuModalOpen = () => {
    setIsMenuModalOpen(true)
  }

  const handleMenuModalClose = () => {
    setIsMenuModalOpen(false)
  }
  const handleResendLink = async () => {
    try {
      const response = await resetLink({
        email: forgotPasswordEmail
      }).unwrap()
      handleMenuModalClose()
      toast({
        position: 'top',
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <Toast
            status="success"
            title={t.Success}
            description={t.pleaseCheckYourMail}
            onClose={onClose}
          />
        )
      })
    } catch (error: any) {
      console.log('Error: ', error)
    }
  }

  return (
    <Box
      mt="-80px"
      className="sign-in-container"
    >
      <BecknAuth
        schema={{
          logo: {
            src: PortalIcon,
            alt: 'netwrk portal logo'
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
              text: 'Forgot password?',
              handleClick: handleMenuModalOpen,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading,
              dataTest: 'forgot-button',
              className: 'forgot_password'
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

      <BottomModal
        title={t.forgotPassword}
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <Text>{t.noWorreis}</Text>
        <FormControl
          mt={4}
          isInvalid={!!forgotPasswordEmailError}
        >
          <Input
            id="email"
            placeholder={t.enterYourMail}
            value={forgotPasswordEmail}
            onChange={handleForgotPasswordEmailChange}
          />
          {forgotPasswordEmailError && (
            <Text
              color="red.500"
              fontSize="sm"
              mt={1}
            >
              {forgotPasswordEmailError}
            </Text>
          )}
        </FormControl>
        <Box mt={4}>
          <BecknButton
            children={t.Send}
            handleClick={handleResendLink}
            variant="solid"
            isLoading={isResetLinkLoading}
            loadingText="Sending..."
          />
          <BecknButton
            children={t.Cancel}
            handleClick={handleMenuModalClose}
            variant="outline"
          />
        </Box>
      </BottomModal>
    </Box>
  )
}

export default SignIn
