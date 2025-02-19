import { Box } from '@chakra-ui/react'
import React from 'react'

const OrderHistory = () => {
  return (
    <Box
      mt="110px"
      padding="0 20px"
      maxH={'calc(100vh - 110px)'}
      overflowY="scroll"
      className="hideScroll"
    ></Box>
  )
}

export default OrderHistory
