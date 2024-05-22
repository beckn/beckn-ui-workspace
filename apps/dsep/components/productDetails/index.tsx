import React, { useEffect, useState } from 'react'
import { ProductSummary, ProductDescription, ProductPrice } from '@beckn-ui/becknified-components'
import { Flex, Box, Text, useTheme } from '@chakra-ui/react'
import router from 'next/router'
import StarRatingComponent from 'react-star-rating-component'
import { ParsedItemModel } from '../../types/search.types'
import { Button, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { cartActions } from '../../store/cart-slice'

interface Props {
  product: ParsedItemModel
}
const ProductDetails: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const [counter, setCounter] = useState(1)
  const { theme } = useTheme()

  useEffect(() => {
    return () => {
      setCounter(1)
    }
  }, [product])

  const dispatch = useDispatch()

  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: counter
      })
    )
    toast.success(t.productAddedToCartMsg, {
      theme: theme === 'dark' ? 'dark' : 'light'
    })
  }

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
              {product.item.short_desc}
            </Text>
            <Flex
              alignItems="center"
              justifyContent="center"
              mb={'20px'}
            >
              <StarRatingComponent
                name="product_rate"
                starCount={5}
                value={parseFloat(product.item.rating)}
              />
              <Text
                fontSize="sm"
                color="text-palette-mute"
                pl="1"
              >
                {product.item.rating ? `${parseFloat(product.item.rating)} Stars` : null}
              </Text>
            </Flex>
            <ProductDescription description={product.item.long_desc} />

            <Box
              marginTop={'20px'}
              padding="15px 10px"
              width={'100%'}
              minWidth={'334px'}
              mb={'30px'}
              border={'2px solid #e5e7eb'}
              borderRadius={'5px'}
            >
              <Box>
                <Typography
                  fontSize="15px"
                  text="Course price"
                  variant="titleSemibold"
                />
                <Box pt={'10px'}>
                  <ProductPrice
                    variant="titleSemibold"
                    price={parseFloat(product.item.price.value)}
                    currencyType={product.item.price.currency}
                  />
                </Box>
              </Box>
              <Box
                as={Button}
                marginTop={5}
                text={t.addToCart}
                handleClick={() => {
                  // router.push('/assemblyDetails')
                  addToCartHandler()
                }}
              ></Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box />
    </Box>
  )
}

export default ProductDetails
