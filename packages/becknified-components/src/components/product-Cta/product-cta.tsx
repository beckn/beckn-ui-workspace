import React from 'react'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { Typography, Button } from '@beckn-ui/molecules'
import { ProductCtaProps } from './product-cta.types'
import useResponsive from '../../hooks/useResponsive'

const ProductCta: React.FC<ProductCtaProps> = ({
  currency,
  totalPrice,
  handleDecrement,
  handleIncrement,
  counter,
  cta
}) => {
  const theme = useTheme()
  const { isMobile } = useResponsive()

  return (
    <Box
      width="100%"
      margin="0 auto"
      border={{ base: '1px solid #D9D9D9', sm: '1px solid #D9D9D9', md: 'none' }}
      p={{ base: '20px 20px 10px 20px', sm: '20px 20px 10px 20px', md: '20px 20px 10px 0px' }}
      borderRadius={'4px'}
      mb="20px"
    >
      {isMobile && (
        <Typography
          text={'Total'}
          variant="subTextSemibold"
          style={{ marginBottom: '6px' }}
        />
      )}

      <Flex
        alignItems={'center'}
        gap="2"
        mb={'10px'}
      >
        <Typography
          text={currency}
          variant="subTitleSemibold"
          color={theme.colors.secondary[100]}
        />
        <Typography
          text={totalPrice}
          variant="subTitleSemibold"
          color={theme.colors.secondary[100]}
        />
      </Flex>
      <Flex
        justifyContent={{ base: 'center', sm: 'center', md: 'flex-start' }}
        alignItems="center"
        gap="4"
        mb="1.5rem"
        mt="1rem"
      >
        <Box
          onClick={handleDecrement}
          fontSize="24px"
        >
          -
        </Box>
        <Box
          border={'1px solid #D9D9D9'}
          color={theme.colors.primary[100]}
          p="2px 20px"
          borderRadius={'4px'}
        >
          {counter}
        </Box>
        <Box
          onClick={handleIncrement}
          fontSize="24px"
        >
          +
        </Box>
      </Flex>
      <Box width={{ base: '100%', md: '50%' }}>
        <Button {...cta} />
      </Box>
    </Box>
  )
}

export default ProductCta