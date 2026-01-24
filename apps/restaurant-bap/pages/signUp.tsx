import React, { useEffect } from 'react'
import Router from 'next/router'
import { Box, Text, Flex, Avatar, useToast } from '@chakra-ui/react'
import { useRegisterMutation } from '@beckn-ui/common/src/services/User'
import CustomSignUp from '../components/auth/CustomSignUp'

const SignUp = () => {
  const [register, { isLoading }] = useRegisterMutation()
  const toast = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any existing auth data on mount
      localStorage.removeItem('rbap_mock_user')
    }
  }, [])

  const handleSignIn = () => {
    Router.push('/signIn')
  }

  const handleSignUp = async (name: string, email: string, password: string, mobile?: string) => {
    try {
      await register({
        username: name,
        email: email,
        password: password,
        mobile: mobile || ''
      }).unwrap()
      // Auth slice will handle the redirect automatically
    } catch (error: unknown) {
      console.error('Sign up error:', error)
      const errorMessage =
        (error as { data?: { error?: { message?: string } } })?.data?.error?.message ||
        'An error occurred during sign up. Please try again.'
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top'
      })
    }
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="16px"
      py="40px"
    >
      <Box
        bg="white"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(0,0,0,0.3)"
        maxW="450px"
        w="100%"
        p={['32px', '40px']}
      >
        <Flex
          direction="column"
          align="center"
          mb="32px"
        >
          <Avatar
            size="xl"
            bg="#FF6B35"
            color="white"
            mb="16px"
            name="QuickBites"
            src=""
          />
          <Text
            fontSize={['32px', '36px']}
            fontWeight="extrabold"
            color="#FF6B35"
            mb="8px"
            textAlign="center"
          >
            QuickBites
          </Text>
          <Text
            fontSize="14px"
            color="gray.600"
            textAlign="center"
          >
            Create your account to get started
          </Text>
        </Flex>
        <CustomSignUp
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  )
}

export default SignUp
