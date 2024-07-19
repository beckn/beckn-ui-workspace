import React from 'react'
import { MouseEventHandler } from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { GeneralTestIds } from '@shared/dataTestIds'

function CartIconWithCount({
  itemCount = 2,
  handleClick
}: {
  itemCount: number
  handleClick?: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <Flex
      position="relative"
      justify="center"
      align="center"
      data-test={GeneralTestIds.cartButton}
      onClick={handleClick}
    >
      <Image
        src="/images/cartIcon.svg"
        alt="Cart"
        boxSize="30px"
      />
      {itemCount > 0 && (
        <Box
          position="absolute"
          top="-1"
          right="-1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="20px"
          height="20px"
          borderRadius="full"
          bgColor="#F6D046"
          color="white"
          fontSize="xs"
        >
          <Text>{itemCount}</Text>
        </Box>
      )}
    </Flex>
  )
}

export default CartIconWithCount
