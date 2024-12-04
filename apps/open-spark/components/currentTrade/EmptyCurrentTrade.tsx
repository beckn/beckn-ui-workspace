import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { Type } from 'react-toastify/dist/utils'

const EmptyCurrentTrade = () => {
  return (
    <Flex
      flexDir={'column'}
      rowGap={'15px'}
      mt={'20px'}
    >
      <Box>
        <Image src="/images/emptyCurrentTrade.svg" />
      </Box>
      <Typography
        text="No Trades Found!!"
        fontSize="15px"
        fontWeight="600"
        sx={{ textAlign: 'center' }}
      />
      <Typography
        text="Click on “Buy” to purchase energy"
        fontSize="15px"
        fontWeight="400"
        sx={{ textAlign: 'center' }}
      />
    </Flex>
  )
}

export default EmptyCurrentTrade
