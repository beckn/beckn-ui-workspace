import React from 'react'
import { Text, Box, Flex, Divider, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { ItemDetailProps } from './checkout.types'
import { useBreakpoint } from '@chakra-ui/react'

const ItemDetails: React.FC<ItemDetailProps> = ({ title, quantity, priceWithSymbol, description, image }) => {
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)
  console.log('Dank', image)

  return (
    <>
      <Box
        pb={'10px'}
        display="flex"
        width="100%"
      >
        {isLargeScreen && (
          <Box mr="1rem">
            <Image
              src={image}
              alt={title}
              width="4rem"
              height="4rem"
            />
          </Box>
        )}
        <Box flexGrow={1}>
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
              text={description}
              variant="subTextRegular"
            />
            <Typography
              text={priceWithSymbol}
              color="primary.100"
              variant="subTitleRegular"
            />
          </Flex>
        </Box>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetails
