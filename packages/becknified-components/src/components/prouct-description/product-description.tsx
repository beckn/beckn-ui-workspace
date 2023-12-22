import React from 'react'
import { ProductDescriptionPropModel } from './product-description.types'
import { Box } from '@chakra-ui/react'

const ProductDescription: React.FC<ProductDescriptionPropModel> = props => {
  const { description, className = '' } = props

  return (
    <Box className={`${className}-product-description-container`}>
      <Box
        className={`${className}-product-description-text-container hideScroll`}
        dangerouslySetInnerHTML={{
          __html: description
        }}
        padding="5px 20px"
        maxHeight={'400px'}
        overflow={'auto'}
        border={'2px solid #e5e7eb'}
        borderRadius={'0.5rem'}
        maxH={'calc(100vh - 100px)'}
        overflowY="scroll"
      ></Box>
    </Box>
  )
}

export default ProductDescription
