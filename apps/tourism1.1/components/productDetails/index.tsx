import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ProductDescription, ProductSummary } from '@beckn-ui/becknified-components'
import StarRatingComponent from 'react-star-rating-component'
import { Button } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '../../types/search.types'
import CallToAction from './CallToAction'

interface Props {
  product: ParsedItemModel
}

// TODO :- remove the static value and add dynamic value for the description

const ProductDetails: React.FC<Props> = ({ product }) => {
  console.log(product)
  const router = useRouter()
  const { t } = useLanguage()
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Flex
        direction="column"
        mt={'10px'}
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
              imageSrc={product.descriptor.images[0]}
              name={product.descriptor.name}
            />
            <Flex
              alignItems="center"
              justifyContent="center"
              mb={'20px'}
            >
              <StarRatingComponent
                name="product_rate"
                starCount={5}
                value={parseFloat(product.rating || 4)}
              />
            </Flex>
            <ProductDescription description={product.descriptor.long_desc} />
            <CallToAction product={product} />
          </Flex>
        </Box>
      </Flex>
      <Box />
    </Box>
  )
}

export default ProductDetails
