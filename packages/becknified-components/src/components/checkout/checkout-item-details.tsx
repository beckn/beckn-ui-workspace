import React from 'react'
import { Text, Box, Flex, Divider } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { ItemDetailProps } from './checkout.types'

const ItemDetails: React.FC<ItemDetailProps> = ({ title, quantity, priceWithSymbol }) => {
  return (
    <>
      <Box pb={'10px'}>
        <Flex
          pb={'5px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            text={title}
            variant="subTitleRegular"
          />
          <Typography
            text={quantity.toString()}
            variant="subTextRegular"
          />
        </Flex>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            text={title}
            variant="subTextRegular"
          />
          <Typography
            text={priceWithSymbol}
            color="primary.100"
            variant="subTitleRegular"
          />
        </Flex>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetails
