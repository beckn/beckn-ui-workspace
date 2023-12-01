import React from 'react'
import { Text, Box, Flex } from '@chakra-ui/react'
import ProductPrice from '../UI/ProductPrice'
import { useLanguage } from '../../hooks/useLanguage'

export interface ItemDetailProps {
  title: string
  provider: string
  address: string
  date: string
  timeSlot: string
  duration: string
}

const ItemDetails: React.FC<ItemDetailProps> = props => {
  const { t } = useLanguage()
  return (
    <>
      <Box pb={'10px'}>
        <Flex
          pb={'5px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text
            fontSize={'15px'}
            fontWeight={700}
          >
            {props.title}
          </Text>{' '}
        </Flex>
        <Flex
          justifyContent={'space-between'}
          flexDir={'column'}
          pb={'5px'}
        >
          <Text
            fontSize={'12px'}
            fontWeight={500}
          >
            {props.provider}
          </Text>
          <Text
            fontSize={'12px'}
            fontWeight={500}
          >
            {props.address}
          </Text>
        </Flex>
        <Flex
          justifyContent={'start'}
          alignItems={'center'}
          pb={'5px'}
        >
          <Text
            fontSize={'12px'}
            fontWeight={600}
          >
            {t.date}
          </Text>
          <Text fontSize={'12px'}>{props.date}</Text>
        </Flex>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDir={'row'}
          pb={'5px'}
        >
          <Text
            fontSize={'12px'}
            fontWeight={600}
          >
            {t.timeslot}
          </Text>
          <Text fontSize={'12px'}>{props.timeSlot}</Text>

          <Text
            fontSize={'12px'}
            fontWeight={600}
          >
            {t.duration}
          </Text>
          <Text fontSize={'12px'}>{props.duration}</Text>
        </Flex>
      </Box>
    </>
  )
}

export default ItemDetails
