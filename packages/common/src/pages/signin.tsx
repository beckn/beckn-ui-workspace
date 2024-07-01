import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { SignInComponentProps } from '../../lib/types'
import SignIn from '../components/signIn/SignIn'

const SignInPage = (props: SignInComponentProps) => {
  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <Box>
      <SignIn {...props} />
    </Box>
  )
}

export default SignInPage
