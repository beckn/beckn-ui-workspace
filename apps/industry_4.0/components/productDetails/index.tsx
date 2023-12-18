import React from 'react'
import { RetailItem } from '../../lib/types/products'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ProductDescription, ProductSummary } from '@beckn-ui/becknified-components'
import CallToAction from './CallToAction'
import StarRatingComponent from 'react-star-rating-component'

interface Props {
  product: RetailItem
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  return (
    <Flex
      direction="column"
      mt={'60px'}
    >
      <Box
        w="full"
        maxW="2100px"
        mx="auto"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          wrap={{ base: 'wrap', md: 'nowrap' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
          pos="relative"
        >
          <ProductSummary
            imageSrc={product.descriptor.images}
            name={product.descriptor.name}
          />
          <Text
            fontSize={'15px'}
            fontWeight={400}
          >
            {product.descriptor.short_desc}
          </Text>
          <Flex
            alignItems="center"
            justifyContent="center"
          >
            <StarRatingComponent
              name="product_rate"
              starCount={5}
              value={parseFloat(product.tags.Rating)}
            />
            <Text
              fontSize="sm"
              color="text-palette-mute"
              pl="1"
            >
              {product.tags.Rating ? `${parseFloat(product.tags.Rating)} stars` : null}
            </Text>
          </Flex>
          <ProductDescription description={product.descriptor.long_desc} />
          <CallToAction product={product} />
        </Flex>
      </Box>
    </Flex>
  )
}

export default ProductDetails
