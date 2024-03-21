import { Button } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ProductDescription, ProductSummary } from '../../components'
import { ProductDetailsPagePropsModel } from './product-detail.types'

const ProductDetailPage: React.FC<ProductDetailsPagePropsModel> = props => {
  const {
    schema: { buttons, productDescription, productSummary }
  } = props
  return (
    <>
      <ProductSummary {...productSummary} />
      {/* <ProductDescription {...productDescription} /> */}
      <Box mt={'20px'}>
        {buttons.map((button, idx) => (
          <Button
            key={idx}
            {...button}
          />
        ))}
      </Box>
    </>
  )
}

export default ProductDetailPage
