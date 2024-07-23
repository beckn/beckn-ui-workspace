import React from 'react'
import { Text, Box, Flex, Divider, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { ItemDetailProps } from './checkout.types'
import { useBreakpoint } from '@chakra-ui/react'
import ProductPrice from '../product-price'
import { CheckoutPageTestIds } from '@shared/dataTestIds'

const ItemDetails: React.FC<ItemDetailProps> = ({ title, quantity, description, image, price, currency }) => {
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)

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
              style={{ width: '90%' }}
              dataTest={CheckoutPageTestIds.itemTitle}
              text={title}
              variant="subTitleRegular"
            />
            <Typography
              text={`X ${quantity.toString()}`}
              dataTest={CheckoutPageTestIds.itemQuantity}
              variant="subTextRegular"
            />
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              text={description!}
              dataTest={CheckoutPageTestIds.itemDescription}
              variant="subTextRegular"
            />
            <ProductPrice
              price={price}
              currencyType={currency}
            />
            {/* <Typography
              text={priceWithSymbol}
              color="primary.100"
              variant="subTitleRegular"
            /> */}
          </Flex>
        </Box>
      </Box>
      <Divider mb={'15px'} />
    </>
  )
}

export default ItemDetails
