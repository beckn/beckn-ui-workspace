import { FeedbackRootState } from '@beckn-ui/common'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Heading, Input, useToast, VStack, Text } from '@chakra-ui/react'
import { useResetPasswordMutation } from '@services/UserService'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Toast } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { InputGroup, InputRightElement, IconButton } from '@chakra-ui/react'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation()
  const toast = useToast()
  const { t } = useLanguage()
  const {
    toast: { display, message, type, description }
  } = useSelector((state: FeedbackRootState) => state.feedback)
  const router = useRouter()
  const { code } = router.query
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const isPasswordStrong = (pass: string): boolean => {
    return pass.length >= 8 && /[@]/.test(pass) && /\d/.test(pass)
  }

  const handleResetPassword = async () => {
    if (!isPasswordStrong(password)) {
      setError(t.passwordMustBe)
    } else if (password !== confirmPassword) {
      setError(t.passwordDoNotMatch)
    } else {
      // TODO: Implement password reset logic here
      try {
        const response = await resetPassword({
          password,
          passwordConfirmation: confirmPassword,
          code
        }).unwrap()
        setError('')
        router.push('/')
        toast({
          position: 'top',
          duration: 5000,
          isClosable: true,
          render: ({ onClose }) => (
            <Toast
              status="success"
              title={t.Success}
              description={t.passwordSucessfully}
              onClose={onClose}
            />
          )
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow={
          'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
        }
        bg="white"
      >
        <Heading
          mb={6}
          textAlign="center"
          fontWeight={800}
          fontSize={'22px'}
        >
          {t.ResetPassword}
        </Heading>
        <VStack spacing={4}>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={t.newPassword}
              value={password}
              onChange={handlePasswordChange}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={togglePasswordVisibility}
                variant="ghost"
                size="sm"
                top={'5px'}
                _hover={'none'}
              />
            </InputRightElement>
          </InputGroup>
          <Input
            type="password"
            placeholder={t.confirmPassword}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {error && (
            <Text
              color="red"
              fontWeight="300"
              textAlign="center"
            >
              {error}
            </Text>
          )}
          <BecknButton
            width="100%"
            mt={2}
            children={t.ResetPassword}
            handleClick={handleResetPassword}
            variant="solid"
            isLoading={isResetPasswordLoading}
            loadingText="Resetting..."
          />
        </VStack>
      </Box>
    </Box>
  )
}

export default ResetPassword
