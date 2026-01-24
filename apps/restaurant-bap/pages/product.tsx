import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Image,
  Text,
  Flex,
  HStack,
  VStack,
  Button,
  IconButton,
  Badge,
  useToast
} from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { DiscoveryRootState, ParsedItemModel } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { FiStar, FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/router'

const Product = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()

  // Get product from Redux store (set when navigating from search/homepage)
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)

  const [counter, setCounter] = useState(1)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    if (selectedProduct?.item?.price?.value) {
      setTotalPrice(Number(selectedProduct.item.price.value))
    }
  }, [selectedProduct])

  const increment = () => {
    if (!selectedProduct) return
    const newCounter = counter + 1
    const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
    setCounter(newCounter)
    setTotalPrice(newTotalPrice)
  }

  const decrement = () => {
    if (counter > 1 && selectedProduct) {
      const newCounter = counter - 1
      const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
      setCounter(newCounter)
      setTotalPrice(newTotalPrice)
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    dispatch(
      cartActions.addItemToCart({
        product: selectedProduct,
        quantity: counter
      })
    )
    dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
      })
    )
    toast({
      title: 'Added to Cart',
      description: `${selectedProduct.item.name} added to cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top'
    })
  }

  if (!selectedProduct) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 200px)"
      >
        <VStack spacing="16px">
          <Text
            fontSize="18px"
            color="gray.600"
          >
            Product not found
          </Text>
          <Button
            colorScheme="orange"
            onClick={() => router.push('/')}
          >
            Go to Homepage
          </Button>
        </VStack>
      </Box>
    )
  }

  // Check for veg/non-veg from tags - support both 'code' and 'name' (API uses 'name')
  const vegTag = selectedProduct.item.tags?.find(
    t =>
      t.code === 'veg_nonveg' ||
      t.code === 'type' ||
      t.name === 'veg_nonveg' ||
      t.name === 'type' ||
      t.name === 'item-properties'
  )
  const isVeg =
    vegTag?.list?.[0]?.value?.toLowerCase() === 'veg' || vegTag?.list?.[0]?.value?.toLowerCase() === 'vegetarian'

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
    >
      <Container
        maxW="1200px"
        px={['16px', '24px']}
        py="24px"
      >
        {/* Back Button */}
        <IconButton
          aria-label="Go Back"
          icon={<FiArrowLeft />}
          variant="ghost"
          mb="16px"
          onClick={() => router.back()}
          size="md"
        />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap="32px"
          bg="white"
          borderRadius="24px"
          overflow="hidden"
          boxShadow="0 4px 20px rgba(0,0,0,0.1)"
        >
          {/* Product Image */}
          <Box
            position="relative"
            w={{ base: '100%', md: '50%' }}
            h={{ base: '300px', md: '500px' }}
            bg="gray.100"
            overflow="hidden"
          >
            <Image
              src={selectedProduct?.item?.images?.[0]?.url || '/images/food-placeholder.svg'}
              alt={selectedProduct.item.name}
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex
                  h="100%"
                  align="center"
                  justify="center"
                  color="gray.400"
                  fontSize="64px"
                >
                  🍽️
                </Flex>
              }
            />
            {vegTag && (
              <Badge
                position="absolute"
                top="16px"
                left="16px"
                bg={isVeg ? 'green.500' : 'red.500'}
                color="white"
                px="12px"
                py="4px"
                borderRadius="8px"
                fontSize="12px"
                fontWeight="700"
              >
                {isVeg ? 'VEG' : 'NON-VEG'}
              </Badge>
            )}
          </Box>

          {/* Product Details */}
          <VStack
            align="start"
            spacing="24px"
            flex="1"
            p={{ base: '24px', md: '40px' }}
          >
            {/* Restaurant Name */}
            <Text
              fontSize="14px"
              color="#FF6B35"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.5px"
            >
              {selectedProduct.providerName}
            </Text>

            {/* Product Name */}
            <Text
              fontSize={{ base: '28px', md: '36px' }}
              fontWeight="800"
              color="gray.800"
              lineHeight="1.2"
            >
              {selectedProduct.item.name}
            </Text>

            {/* Rating */}
            {selectedProduct.item.rating && (
              <HStack spacing="8px">
                <HStack spacing="4px">
                  <FiStar
                    size="20px"
                    fill="#FFD700"
                    color="#FFD700"
                  />
                  <Text
                    fontSize="18px"
                    fontWeight="700"
                    color="gray.700"
                  >
                    {selectedProduct.item.rating}
                  </Text>
                </HStack>
                <Text
                  fontSize="14px"
                  color="gray.500"
                >
                  • Excellent
                </Text>
              </HStack>
            )}

            {/* Price */}
            <Box>
              <Text
                fontSize="32px"
                fontWeight="800"
                color="#FF6B35"
              >
                {selectedProduct.item.price.currency === 'INR' ? '₹' : selectedProduct.item.price.currency}
                {selectedProduct.item.price.value}
              </Text>
            </Box>

            {/* Description */}
            {(selectedProduct.item.long_desc || selectedProduct.item.short_desc) && (
              <Box>
                <Text
                  fontSize="16px"
                  fontWeight="600"
                  color="gray.800"
                  mb="8px"
                >
                  Description
                </Text>
                <Text
                  fontSize="15px"
                  color="gray.600"
                  lineHeight="1.6"
                >
                  {selectedProduct.item.long_desc || selectedProduct.item.short_desc}
                </Text>
              </Box>
            )}

            {/* Quantity Selector */}
            <Box w="100%">
              <Text
                fontSize="16px"
                fontWeight="600"
                color="gray.800"
                mb="12px"
              >
                Quantity
              </Text>
              <HStack
                spacing="16px"
                align="center"
              >
                <HStack
                  spacing="12px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="12px"
                  p="8px"
                >
                  <IconButton
                    aria-label="Decrease"
                    icon={<FiMinus />}
                    size="sm"
                    onClick={decrement}
                    isDisabled={counter === 1}
                    bg={counter === 1 ? 'gray.100' : 'white'}
                    color={counter === 1 ? 'gray.400' : 'gray.700'}
                    _hover={{ bg: counter === 1 ? 'gray.100' : 'gray.50' }}
                  />
                  <Text
                    fontSize="20px"
                    fontWeight="700"
                    color="gray.800"
                    minW="40px"
                    textAlign="center"
                  >
                    {counter}
                  </Text>
                  <IconButton
                    aria-label="Increase"
                    icon={<FiPlus />}
                    size="sm"
                    onClick={increment}
                    bg="white"
                    color="gray.700"
                    _hover={{ bg: 'gray.50' }}
                  />
                </HStack>
                <Text
                  fontSize="20px"
                  fontWeight="700"
                  color="gray.800"
                >
                  Total: {selectedProduct.item.price.currency === 'INR' ? '₹' : selectedProduct.item.price.currency}
                  {totalPrice.toFixed(2)}
                </Text>
              </HStack>
            </Box>

            {/* Add to Cart Button */}
            <Button
              w="100%"
              bg="#FF6B35"
              color="white"
              size="lg"
              borderRadius="12px"
              fontSize="18px"
              fontWeight="700"
              py="24px"
              leftIcon={<FiShoppingCart />}
              onClick={handleAddToCart}
              _hover={{
                bg: '#E55A2B',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
              }}
              _active={{ bg: '#CC4F24' }}
            >
              Add to Cart
            </Button>
          </VStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Product
