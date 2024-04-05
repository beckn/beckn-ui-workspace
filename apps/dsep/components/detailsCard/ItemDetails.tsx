import React from 'react'
import { Text, Box, Image, Flex, Divider } from '@chakra-ui/react'
import { CurrencyType, ProductPrice } from '@beckn-ui/becknified-components'

export interface ItemDetailProps {
  title: string
  provider: string
  quantity: number
  price: string | number
  currencyType: CurrencyType
}

const ItemDetails: React.FC<ItemDetailProps> = props => {
  return (
    <>
      <Box pb={'10px'}>
        <Flex
          pb={'5px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text fontSize={'15px'}>{props.title}</Text> {/* <Text fontSize={"12px"}>x{props.quantity}</Text> */}
        </Flex>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text fontSize={'12px'}>Sold by {props.provider}</Text>
          <ProductPrice
            currencyType={props.currencyType}
            price={parseFloat(props.price as string)}
          />
        </Flex>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetails
