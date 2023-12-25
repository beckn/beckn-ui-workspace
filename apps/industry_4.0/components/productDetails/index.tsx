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
              mb={'20px'}
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
            <ProductDescription
              description={`<h1>Intermittent Assembly Product - Enhanced Efficiency, Unmatched Performance!</h1></br><p>Welcome to the future of assembly technology! Our Intermittent Assembly product is designed to revolutionize your workflow, providing unparalleled efficiency and precision. </p></br><p>Key Features:</p> </br><ul><li>Intermittent Assembly Technology for precise and controlled assembly processes.</li><li>Advanced automation to streamline repetitive tasks, saving you time and resources.</li><li>Durable materials ensuring longevity and reliability.</li><li>Customizable settings to adapt to various assembly requirements.</li></ul> <p>Whether you are in manufacturing, engineering, or a related field, our Intermittent Assembly product is your gateway to increased productivity and reduced production times.</p><p>Don't miss out on the advantages:</p><ul><li>Enhanced precision in every assembly task.</li><li>Seamless integration into existing workflows.</li><li>Intuitive user interface for easy operation.</li></ul></br><p>Invest in the future of assembly technology. Elevate your production capabilities with our Intermittent Assembly product today!</p><footer>
        <p>For inquiries, please contact us at info@yourcompany.com</p></footer>`}
            />
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
      <Box />
    </Box>
  )
}

export default ProductDetails
