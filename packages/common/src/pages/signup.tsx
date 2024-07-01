import { Box } from '@chakra-ui/react'
import React from 'react'
import { SignUpComponentProps } from '../../lib/types'
import SignUp from '../components/signUp/signUp'

const SignUpPage = (props: SignUpComponentProps) => {
  return (
    <Box>
      <SignUp {...props} />
    </Box>
  )
}

export default SignUpPage
