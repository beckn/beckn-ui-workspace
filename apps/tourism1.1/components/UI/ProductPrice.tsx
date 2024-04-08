import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface Props {
  price: number
  discount?: number
  isLargeSize?: boolean
  isInSlider?: boolean
}
const ProductPrice: React.FC<Props> = ({ price, isLargeSize = false, isInSlider }) => {
  const { t, locale } = useLanguage()

  //style base on component position
  const textMainPriceSize = isLargeSize ? ' md:text-3xl' : ' md:text-lg'
  const textDiscountPriceSize = isLargeSize ? ' md:text-xl' : ' md:text-md'
  const justifyContent = isInSlider && locale === 'fa' ? 'flex-start' : ''
  const flexDirection = 'row'

  return (
    <div>
      <Flex
        justifyContent={'flex-start'}
        flexDir={'row'}
      >
        <Flex flexDir={'row'}>
          <span className="mr-1 rtl:block">{t.currencySymbol}</span>
          <span>{price.toFixed(2)}</span>
        </Flex>
      </Flex>
    </div>
  )
}

export default ProductPrice
