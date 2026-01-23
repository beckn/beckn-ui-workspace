import React, { useEffect } from 'react'
import Router from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPage } from '@beckn-ui/common'
import { Box } from '@chakra-ui/react'

const SignIn = () => {
  const { t } = useLanguage()

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="16px"
    >
      <Box
        bg="white"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(0,0,0,0.3)"
        maxW="450px"
        w="100%"
        p="40px"
      >
        <SignInPage
          logos={{
            mobile: { src: '/images/logo.svg', alt: 'FoodDelivery logo' },
            desktop: { src: '/images/logo.svg', alt: 'FoodDelivery logo' }
          }}
          onSignIn={() => {}}
          onSignUp={handleSignUp}
          t={key => t[key]}
        />
      </Box>
    </Box>
  )
}

export default SignIn
