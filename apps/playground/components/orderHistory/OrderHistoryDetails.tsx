import React, { useState } from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import pendingIcon from '../../public/images/pending.svg'
import completedIcon from '../../public/images/completed.svg'

interface OrderHistoryDetailsPropsModel {
  createdAt: string
  orderId: string
  totalAmount: number
  quantity: number
  orderState: string
}

const OrderHistoryDetails: React.FC<OrderHistoryDetailsPropsModel> = props => {
  return (
    <Box>
      <Text pb={'5px'} fontSize={'10px'}>
        Placed at {props.createdAt}
      </Text>
      <Text fontWeight="600" pb={'5px'} fontSize={'12px'}>
        Order Details Id <span style={{ fontWeight: '700' }}>{props.orderId}</span>
      </Text>
      <Text fontWeight="600" pb={'5px'} fontSize={'10px'}>
        Order in progress
      </Text>
      <Text fontWeight="600" pb={'5px'} fontSize={'12px'}>
        € {props.totalAmount}
      </Text>
      <Flex fontSize={'10px'} justifyContent={'space-between'} alignItems={'center'}>
        <Text>{props.quantity} items</Text>
        <Flex>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src={props.orderState === 'completed' || props.orderState === 'Complété' ? completedIcon : pendingIcon}
            paddingRight={'6px'}
          />
          <Text>{props.orderState}</Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OrderHistoryDetails
