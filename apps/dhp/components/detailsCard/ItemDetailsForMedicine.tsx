import React from 'react'
import { Text, Box, Image, Flex, Divider } from '@chakra-ui/react'
import ProductPrice from '../UI/ProductPrice'

export interface ItemDetailsForMedicineProps {
  medicineName: string
  quantity: number | string
  description: string
  price: string | number
}

const ItemDetailsForMedicine: React.FC<ItemDetailsForMedicineProps> = props => {
  return (
    <>
      <Box pb={'10px'}>
        <Flex pb={'5px'} justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'15px'}>{props.medicineName}</Text> <Text fontSize={'12px'}>x{props.quantity}</Text>
        </Flex>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'12px'}>{props.description}</Text>
          <ProductPrice price={props.price as number} />
        </Flex>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetailsForMedicine
