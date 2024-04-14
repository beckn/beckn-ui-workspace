import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Signin from '@components/signIn/SignIn'

const MobileLogin = () => {
  // useEffect(() => {
  //   localStorage.clear()
  // }, [])

  return (
    <Box padding={'0 21px'}>
      <Signin />
    </Box>
  )
}

export default MobileLogin
