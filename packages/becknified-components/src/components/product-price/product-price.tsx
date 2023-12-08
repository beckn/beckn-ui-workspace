import { Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { ProductPriceProps } from './ProductPrice.types'
import Styles from './product-price.module.css'
import { Typography } from '@beckn-ui/molecules'

const ProductPrice: React.FC<ProductPriceProps> = props => {
  const { price, currencySymbol = '₹', toFixed = 2, color = 'primary.100', className = '', rtl = false } = props

  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      width={'42px'}
      fontSize={'15px'}
      fontWeight={'600'}
      color={color}
      className={className}
    >
      <Text
        order={rtl ? 1 : 0}
        className={Styles.currency_symbol_span}
        color={color}
      >
        {currencySymbol}
      </Text>
      <Typography
        text={price.toFixed(toFixed)}
        color={color}
      />
    </Flex>
  )
}

export default ProductPrice
