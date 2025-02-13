import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import { ROLE } from '@lib/config'
import { RootState } from '@store/index'
import React from 'react'
import { useSelector } from 'react-redux'

const EmptyScreenTemplate = ({ text, description, src }: { text: string; description?: string; src: string }) => {
  return (
    <Flex
      flexDir={'column'}
      rowGap={'15px'}
      p={'2rem 0'}
      justifySelf="center"
    >
      <Image
        src={src}
        data-test="empty-img"
        alignSelf="center"
      />
      <Typography
        fontSize="12px"
        fontWeight="500"
        sx={{ textAlign: 'center', color: '#4D4D4D' }}
        text={text}
        dataTest="emptyText"
      />
      <Typography
        fontSize="10px"
        fontWeight="400"
        sx={{ textAlign: 'center', color: '#8B8B8B', lineHeight: '16px', width: '14rem' }}
        text={description}
        dataTest="emptyTextDesc"
      />
    </Flex>
  )
}

export default EmptyScreenTemplate
