import { Box } from '@chakra-ui/react'
import React from 'react'
import { ProductPriceProps } from './ProductPrice.types'

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
        className={`flex items-center md:text-lg font-semibold no-underline ${className}_product_Price`}
        flexDirection={'row'}
      >
        <span className="mr-1 rtl:block">{currencySymbol}</span>
        <span>{price.toFixed(toFixed)}</span>
      </Box>
    </>
  )
}

export default ProductPrice
