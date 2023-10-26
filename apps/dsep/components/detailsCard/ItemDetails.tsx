import React from 'react'
import { Text, Box, Image, Flex, Divider } from '@chakra-ui/react'
import ProductPrice from '../UI/ProductPrice'

export interface ItemDetailProps {
  title: string
  provider: string
  quantity: number
  price: string | number
}

const ItemDetails: React.FC<ItemDetailProps> = props => {
  return (
    <>
      <Box pb={'10px'}>
        <Flex pb={'5px'} justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'15px'}>{props.title}</Text> {/* <Text fontSize={"12px"}>x{props.quantity}</Text> */}
        </Flex>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'12px'}>Sold by {props.provider}</Text>
          <ProductPrice price={props.price as number} />
        </Flex>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetails
