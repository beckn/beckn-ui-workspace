import React from 'react'
import { Box } from '@chakra-ui/react'

const RideHistory = () => {
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
    ></Box>
  )
}

export default RideHistory
