import React from 'react'
import { ProductDescriptionPropModel } from './product-description.types'
import { Box } from '@chakra-ui/react'
import useResponsive from '../../hooks/useResponsive'

const ProductDescription: React.FC<ProductDescriptionPropModel> = props => {
  const { description, className = '' } = props
  const { isMobile, isTablet } = useResponsive()
  const isSmallScreen = isMobile || isTablet

  return (
    <Box className={`${className}-product-description-container`}>
      <Box
        dangerouslySetInnerHTML={{
          __html: description
        }}
        padding={isSmallScreen ? '5px 20px' : '5px 0'}
        maxHeight={'400px'}
        overflow={'auto'}
        border={isSmallScreen ? '1px solid #e2e8f0' : 'none'}
        borderRadius={'0.5rem'}
        maxH={'calc(100vh - 100px)'}
        overflowY={isSmallScreen ? 'auto' : 'hidden'}
      ></Box>
    </Box>
  )
}

export default ProductDescription
