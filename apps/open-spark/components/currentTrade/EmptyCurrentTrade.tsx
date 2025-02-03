import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import { ROLE } from '@lib/config'
import { RootState } from '@store/index'
import React from 'react'
import { useSelector } from 'react-redux'

const EmptyCurrentTrade = ({ text }: { text: string }) => {
  return (
    <Flex
      flexDir={'column'}
      rowGap={'15px'}
      mt={'20px'}
    >
      <Box>
        <Image
          src="/images/empty_trade.svg"
          data-test="empty-trade-img"
        />
      </Box>
      <Typography
        fontSize="15px"
        fontWeight="400"
        sx={{ textAlign: 'center' }}
        text={`your data will appear here once you start ${text} energy `}
        dataTest="emptyCurrentText"
      />
    </Flex>
  )
}

export default EmptyCurrentTrade
