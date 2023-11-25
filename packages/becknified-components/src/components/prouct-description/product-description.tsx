import React from 'react'
import { ProductDescriptionPropModel } from './product-description.types'
import { Box } from '@chakra-ui/react'

const ProductDescription: React.FC<ProductDescriptionPropModel> = props => {
  const { description, className = '' } = props

  return (
    <Box className={`${className}-product-description-container`}>
      <Box
        className={`${className}-product-description-text-container`}
        dangerouslySetInnerHTML={{
          __html: description
        }}
        padding="5px 10px"
        maxHeight={'400px'}
        overflow={'auto'}
        border={'2px solid #e5e7eb'}
        borderRadius={'0.5rem'}
      ></Box>
    </Box>
  )
}

export default ProductDescription
