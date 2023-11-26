import { Typography } from '@beckn-ui/molecules'
import { Box, Image, Flex } from '@chakra-ui/react'
import React from 'react'
import { ProductSummaryPropsModel } from './product-summary.types'

const ProductSummary: React.FC<ProductSummaryPropsModel> = props => {
  const { imageSrc, name, itemForRenderer, ProductSummaryRenderer, className = '' } = props

  return (
    <>
      {ProductSummaryRenderer ? (
        <ProductSummaryRenderer item={itemForRenderer} />
      ) : (
        <Box
          display={'flex'}
          width={'100%'}
          mb={'20px'}
          className={`${className}-product_summary_container`}
        >
          <Flex
            gap={'10px'}
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
          >
            <Box className={`${className}-product_summary_image_container`}>
              <Image
                src={imageSrc}
                alt={'product_img'}
                objectFit={'contain'}
                className={`${className}-product_summary_image`}
              />
            </Box>

            <Box textAlign={'center'}>
              <Typography
                className={`${className}-product_summary_name`}
                text={name}
                fontSize={'20px'}
                fontWeight={'500'}
              />
            </Box>
          </Flex>
        </Box>
      )}
    </>
  )
}

export default ProductSummary
