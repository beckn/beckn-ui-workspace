import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import { ROLE } from '@lib/config'
import { RootState } from '@store/index'
import React from 'react'
import { useSelector } from 'react-redux'

const EmptyCurrentTrade = () => {
  const { role } = useSelector((state: RootState) => state.auth)
  const emptyCurrentText = role === ROLE.CONSUMER ? '"Buy"' : '"Sell"'
  const sellText = role === ROLE.PRODUCER ? 'sell' : 'purchase'
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
        fontSize="15px"
        fontWeight="400"
        sx={{ textAlign: 'center' }}
        text={`Click on ${emptyCurrentText} to ${sellText} energy`}
      />
    </Flex>
  )
}

export default EmptyCurrentTrade
