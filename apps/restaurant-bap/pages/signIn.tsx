import React, { useEffect } from 'react'
import Router from 'next/router'
import { Box, Text, Flex, Avatar, useToast } from '@chakra-ui/react'
import { useLoginMutation } from '@beckn-ui/common/src/services/User'
import CustomSignIn from '../components/auth/CustomSignIn'

const SignIn = () => {
  const [login, { isLoading }] = useLoginMutation()
  const toast = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any existing auth data on mount
      localStorage.removeItem('rbap_mock_user')
    }
  }, [])

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      await login({
        identifier: email,
        password: password
      }).unwrap()
      // Auth slice will handle the redirect automatically
    } catch (error: unknown) {
      console.error('Sign in error:', error)
      const errorMessage =
        (error as { data?: { error?: { message?: string } } })?.data?.error?.message ||
        'Invalid email or password. Please try again.'
      toast({
        title: 'Login Failed',
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
            mb="16px"
          >
            Sign in to continue
          </Text>
        </Flex>
        <CustomSignIn
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  )
}

export default SignIn
