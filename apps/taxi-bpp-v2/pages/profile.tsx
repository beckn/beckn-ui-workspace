import React from 'react'
import { Box } from '@chakra-ui/react'

const ProfilePage = () => {
  return (
    <Box
      margin={'0 auto'}
      mt={['-20px', '-20px', '-70px', '-70px']}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll osc_profile"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    ></Box>
  )
}

export default ProfilePage
