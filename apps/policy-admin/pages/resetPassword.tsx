import { FeedbackRootState, ToastType } from '@beckn-ui/common'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Heading, Input, useToast, VStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()
  const {
    toast: { display, message, type, description }
  } = useSelector((state: FeedbackRootState) => state.feedback)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const isPasswordStrong = (pass: string): boolean => {
    return pass.length >= 8 && /[@]/.test(pass) && /\d/.test(pass)
  }

  const handleResetPassword = () => {
    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long and include @ and a number')
    } else if (password !== confirmPassword) {
      setError('Passwords do not match')
    } else {
      // TODO: Implement password reset logic here
      setError('')
      toast({
        position: 'top',
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <Toast
            status={type as ToastType}
            title={'Success'}
            description={'Password reset successfully'}
            onClose={onClose}
          />
        )
      })
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="gray.100"
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading
          mb={6}
          textAlign="center"
        >
          Reset Password
        </Heading>
        <VStack spacing={4}>
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
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
            children={'Reset Password'}
            handleClick={handleResetPassword}
            variant="solid"
          />
        </VStack>
      </Box>
    </Box>
  )
}

export default ResetPassword
