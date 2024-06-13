import { Typography, Button } from '@beckn-ui/molecules'
import { StarRating } from '@beckn-ui/becknified-components'
import { Box, Image, Flex } from '@chakra-ui/react'
import React from 'react'
import { ProductSummaryPropsModel } from './product-summary.types'
import ProductDescription from '../prouct-description'
import ProductCTA from '../product-Cta'

const ProductSummary: React.FC<ProductSummaryPropsModel> = props => {
  const {
    imageSrc,
    name,
    itemForRenderer,
    ProductSummaryRenderer,
    className = '',
    secondaryCTAs,
    secondaryDescription,
    starRating,
    productCta
  } = props

  return (
    <>
      {ProductSummaryRenderer ? (
        <ProductSummaryRenderer item={itemForRenderer} />
      ) : (
        <Box
          display={'flex'}
          width={'100%'}
          mb={'20px'}
          mt={{ base: '2rem', xl: '5rem' }}
          data-testid="test-product-summary"
          className={`${className}-product_summary_container`}
        >
          <Flex
            gap={'10px'}
            direction={{ base: 'column', md: 'row', lg: 'row', xl: 'row', '2xl': 'row' }}
            alignItems={'center'}
            width={'100%'}
          >
            <Box className={`${className}-product_summary_image_container`}>
              <Image
                src={imageSrc}
                width={{ base: '21.8rem', md: '25rem', lg: '25rem', xl: '25rem', '2xl': '25rem' }}
                height={200}
                alt={'product_img'}
                objectFit={'contain'}
                className={`${className}-product_summary_image`}
              />
            </Box>
            <Flex
              gap={'10px'}
              direction={'column'}
              alignItems={{ base: 'center', md: 'flex-start', lg: 'flex-start', xl: 'flex-start', '2xl': 'flex-start' }}
              width={'100%'}
            >
              <Box>
                <Typography
                  className={`${className}-product_summary_name`}
                  text={name}
                  fontSize={'20px'}
                  fontWeight={'500'}
                />
              </Box>
              {starRating && <StarRating {...starRating} />}
              {secondaryDescription && (
                <Box minHeight="10rem">
                  <ProductDescription description={secondaryDescription as string} />
                </Box>
              )}
              {secondaryCTAs && secondaryCTAs.length > 0 && (
                <Box width={{ base: '100%', lg: '50%' }}>
                  <Button {...secondaryCTAs[0]} />
                </Box>
              )}
              {productCta && <ProductCTA {...productCta} />}
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  )
}

export default ProductSummary
