import { Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { ProductPriceProps } from './ProductPrice.types'
import Styles from './product-price.module.css'

const ProductPrice: React.FC<ProductPriceProps> = props => {
  const {
    price,
    currencySymbol = '₹',
    toFixed = 2,
    color = 'rgba(var(--color-primary))',
    className = '',
    rtl = false
  } = props

  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      width={'54px'}
      fontSize={'15px'}
      fontWeight={'600'}
      color={color}
      className={className}
    >
      <Text
        order={rtl ? 1 : 0}
        className={Styles.currency_symbol_span}
      >
        {currencySymbol}
      </Text>
      <Text>{price.toFixed(toFixed)}</Text>
    </Flex>
  )
}

export default ProductPrice
