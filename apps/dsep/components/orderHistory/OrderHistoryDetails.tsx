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
  orderedItemName: string
}

const OrderHistoryDetails: React.FC<OrderHistoryDetailsPropsModel> = props => {
  return (
    <Box>
      <Text fontWeight="600" pb={'5px'} fontSize={'12px'}>
        <span style={{ fontWeight: '700' }}>{props.orderedItemName}</span>
      </Text>
      <Text pb={'5px'} fontSize={'10px'}>
        Placed at {props.createdAt}
      </Text>

      <Text pb={'5px'} fontSize={'10px'}>
        Order ID: {props.orderId}
      </Text>
      <Text fontWeight="600" pb={'5px'} fontSize={'12px'}>
        ₹ {props.totalAmount}
      </Text>
      <Flex fontSize={'10px'} justifyContent={'space-between'} alignItems={'center'}>
        <Text>{props.quantity} items</Text>
        <Flex>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={completedIcon} paddingRight={'6px'} />
          <Text>Purchased</Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OrderHistoryDetails
