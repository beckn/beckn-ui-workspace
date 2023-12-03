import { Box } from '@chakra-ui/react'
import { useTheme, Theme } from '@chakra-ui/react'
import classNames from 'classnames'
import React from 'react'
import Styles from './product-price.module.css'

import { CustomThemeType } from '@beckn-ui/molecules'

export interface ProductPriceProps {
  price: number
  discount?: number
  isLargeSize?: boolean
  isInSlider?: boolean
  symbol: string
  isRtl?: boolean
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  isLargeSize = false,
  isInSlider,
  symbol = '€',
  isRtl = false
}) => {
  const justifyContent = isInSlider && isRtl ? 'flex-start' : ''
  const flexDirection = 'row'
  const theme = useTheme<CustomThemeType>()
  const color = theme.colors.primary[100]

  const prouctPriceContainerClassNames = classNames({
    product_price_container: true,
    large_product_price_container: isLargeSize,
    small_product_price_container: !isLargeSize
  })

  return (
    <div>
      <div
        className={Styles.prouct_price_layout_container}
        style={{ justifyContent }}
      >
        <div>
          <Box
            color={color}
            className={Styles[`${prouctPriceContainerClassNames}`]}
            style={{
              flexDirection
            }}
          >
            <span className={Styles.currency_symbol}>{symbol}</span>
            <span>{price.toFixed(2)}</span>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default ProductPrice
