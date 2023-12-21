import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ProductDescription, ProductSummary } from '@beckn-ui/becknified-components'
import StarRatingComponent from 'react-star-rating-component'
import { Button } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '../../types/search.types'

interface Props {
  product: ParsedItemModel
}

// TODO :- remove the static value and add dynamic value for the description

const ProductDetails: React.FC<Props> = ({ product }) => {
  const router = useRouter()
  const { t } = useLanguage()

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
            imageSrc={product.item.images[0].url}
            name={product.item.name}
          />
          <Text
            fontSize={'15px'}
            fontWeight={400}
          >
            mock short description
            {/* {product.descriptor.short_desc} */}
          </Text>
          <Flex
            alignItems="center"
            justifyContent="center"
          >
            <StarRatingComponent
              name="product_rate"
              starCount={5}
              value={parseFloat(product.rating)}
            />
            <Text
              fontSize="sm"
              color="text-palette-mute"
              pl="1"
            >
              {product.rating ? `${parseFloat(product.rating)} stars` : null}
            </Text>
          </Flex>
          {/* <ProductDescription description={product.descriptor.long_desc} /> */}
          <ProductDescription description={'<p>Long mock description</p>'} />
          <Box
            as={Button}
            marginTop={5}
            text={t.book}
            handleClick={() => {
              router.push('/checkoutPage')
            }}
          ></Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default ProductDetails
