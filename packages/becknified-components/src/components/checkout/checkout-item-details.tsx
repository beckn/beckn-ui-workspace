import React from 'react'
import { Text, Box, Flex, Divider } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'

export interface ItemDetailProps {
  title: string
  description: string
  quantity: number
  price: string | number
}

const ItemDetails: React.FC<ItemDetailProps> = ({ title, quantity, price }) => {
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
            text={price.toString()}
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
