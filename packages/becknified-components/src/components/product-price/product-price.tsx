import { Flex, useTheme } from '@chakra-ui/react'
import React from 'react'
import { CurrencyType, ProductPriceProps } from './ProductPrice.types'
import { Typography } from '@beckn-ui/molecules'

const formatCurrency = (price: number, currencyType: CurrencyType) => {
  const currencyOptions = {
    GBP: { locale: 'en-GB', currency: 'GBP' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    INR: { locale: 'en-IN', currency: 'INR' },
    USD: { locale: 'en-US', currency: 'USD' }
  }

  const { locale, currency } = currencyOptions[currencyType]

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price)
}

const ProductPrice: React.FC<ProductPriceProps> = props => {
  const theme = useTheme()

  const {
    price,
    currencyType = 'INR',
    color = 'secondary.100',
    className = '',
    variant = 'subTextSemibold',
    fontStyle,
    colorScheme = 'secondary'
  } = props

  const textColor = colorScheme === 'primary' ? theme.colors.primary[100] : theme.colors.secondary[100]

  return (
    <Flex
      align={'center'}
      justify={'space-between'}
      // width={'42px'}
      fontSize={'15px'}
      fontWeight={'600'}
      color={color}
      className={className}
    >
      <Typography
        variant={variant}
        text={formatCurrency(price, currencyType)}
        color={color || textColor}
        style={fontStyle}
      />
    </Flex>
  )
}

export default ProductPrice
