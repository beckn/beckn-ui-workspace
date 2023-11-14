import { Box } from '@chakra-ui/react'
import React from 'react'
import { ProductPriceProps } from './ProductPrice.types'
import Styles from './product-price.module.css'

const ProductPrice: React.FC<ProductPriceProps> = props => {
  const {
    price,
    isLargeSize = false,
    currencySymbol = '₹',
    toFixed = 2,
    color = 'rgba(var(--color-primary))',
    className = '',
    ...restProps
  } = props

  return (
    <>
      <Box
        color={color}
        className={`${Styles.product_price_container} ${className}_product_Price`}
      >
        <span className={Styles.currency_symbol_span}>{currencySymbol}</span>
        <span>{price.toFixed(toFixed)}</span>
      </Box>
    </>
  )
}

export default ProductPrice
