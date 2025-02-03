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
      p={'0 2rem'}
    >
      <Image
        src="/images/empty_trade.svg"
        data-test="empty-trade-img"
        width="100px"
        height="100px"
        alignSelf="center"
      />
      <Typography
        fontSize="12px"
        fontWeight="400"
        sx={{ textAlign: 'center' }}
        text={`your data will appear here once you start ${text} energy `}
        dataTest="emptyCurrentText"
      />
    </Flex>
  )
}

export default EmptyCurrentTrade
