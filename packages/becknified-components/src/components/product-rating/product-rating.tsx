import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { ProductRatingPropsModel } from './product-rating.types'

export const ProductRating: React.FC<ProductRatingPropsModel> = props => {
  const { ratingIcon, ratingValue, className = '' } = props
  return (
    <Flex
      className={className}
      alignItems={'center'}
    >
      <Image
        alt="rating icon"
        src={ratingIcon}
      />
      <Text
        fontWeight={400}
        fontSize={'12px'}
        pl={'5px'}
      >
        {ratingValue}
      </Text>
    </Flex>
  )
}
