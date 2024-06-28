import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Signin from '@components/signIn/SignIn'

const Login = () => {
  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <Box>
      <Signin />
    </Box>
  )
}

export default Login
