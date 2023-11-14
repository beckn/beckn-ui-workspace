import { Box } from '@chakra-ui/react'
import classNames from 'classnames'
import React from 'react'
import Styles from './product-price.module.css'

interface Props {
  price: number
  discount?: number
  isLargeSize?: boolean
  isInSlider?: boolean
  locale: string
  t: any
}
const ProductPrice: React.FC<Props> = ({ price, isLargeSize = false, isInSlider, t, locale }) => {
  const justifyContent = isInSlider && locale === 'fa' ? 'flex-start' : ''
  const flexDirection = 'row'

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
            color={'rgba(var(--color-primary))'}
            className={Styles[`${prouctPriceContainerClassNames}`]}
            style={{
              flexDirection
            }}
          >
            <span className={Styles.currency_symbol}>{t.currencySymbol}</span>
            <span>{price.toFixed(2)}</span>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default ProductPrice
