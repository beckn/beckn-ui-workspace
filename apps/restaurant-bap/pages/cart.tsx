import { useRouter } from 'next/router'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { Box, Container, Text, Flex, HStack, VStack, Button, IconButton, Image, Divider } from '@chakra-ui/react'
import { getSelectPayload } from '@beckn-ui/common/src/utils'
import { DiscoveryRootState, ICartRootState, Quote } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { CheckoutRootState } from '@beckn-ui/common'
import { checkoutActions } from '@beckn-ui/common/src/store/checkout-slice'
import { FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { CurrencyType } from '@beckn-ui/becknified-components'

const Cart = () => {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [fetchQuotes, { isLoading }] = useSelectMutation()
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useLanguage()

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const prevTotalQuantityRef = useRef(totalQuantity)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const { selectResponse } = useSelector((state: CheckoutRootState) => state.checkout)

  useEffect(() => {
    if (items.length > 0) {
      fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
    }
    if (prevTotalQuantityRef.current !== totalQuantity) {
      dispatch(checkoutActions.resetInitResponse())
      prevTotalQuantityRef.current = totalQuantity
    }
  }, [totalQuantity])

  useEffect(() => {
    if (selectResponse && selectResponse.length > 0) {
      const finalQuote = { value: 0, currency: 'INR' }
      selectResponse.forEach(response => {
        const qoute = response.message.order.quote
        if (Number(qoute.price.value)) {
          finalQuote.value = finalQuote.value + Number(qoute.price.value)
          finalQuote.currency = qoute.price.currency
        }
      })
      setQuote({
        price: { value: finalQuote.value.toString(), currency: finalQuote.currency as CurrencyType },
        breakup: []
      })
    }
  }, [selectResponse])

  const handleShopButton = () => {
    router.push('/')
  }

  const onOrderClick = () => {
    router.push('/checkout')
  }

  const handleIncrement = (id: string) => {
    const selectedItem = productList.find(singleItem => singleItem.item.id === id)
    if (selectedItem) {
      dispatch(cartActions.addItemToCart({ product: selectedItem, quantity: 1 }))
    }
  }

  const handleDecrement = (id: string) => {
    dispatch(cartActions.removeItemFromCart(id))
  }

  if (items.length === 0) {
    return (
      <Box
        bg="gray.50"
        minH="calc(100vh - 100px)"
        py="24px"
      >
        <Container
          maxW="1200px"
          px={['16px', '24px']}
        >
          <VStack
            spacing="24px"
            py="80px"
            align="center"
          >
            <Box
              fontSize="80px"
              mb="16px"
            >
              🛒
            </Box>
            <Text
              fontSize="24px"
              fontWeight="700"
              color="gray.800"
            >
              {t.emptyCardHeading || 'Your cart is empty'}
            </Text>
            <Text
              fontSize="16px"
              color="gray.600"
              textAlign="center"
            >
              {t.emptyCardSubHeading || 'Add delicious food items to your cart'}
            </Text>
            <Button
              bg="#FF6B35"
              color="white"
              size="lg"
              borderRadius="12px"
              px="32px"
              py="24px"
              fontSize="16px"
              fontWeight="700"
              leftIcon={<FiShoppingBag />}
              onClick={handleShopButton}
              _hover={{
                bg: '#E55A2B',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
              }}
            >
              {t.shop || 'Start Shopping'}
            </Button>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '16px', md: '20px' }}
    >
      <Container
        maxW="1200px"
        px={{ base: '16px', md: '24px' }}
      >
        {/* Header */}
        <Flex align="center">
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft size="28px" />}
            variant="ghost"
            onClick={() => router.back()}
            size="lg"
            w="56px"
            h="56px"
            minW="56px"
            fontSize="24px"
          />
          <Text
            fontSize={{ base: '20px', md: '24px' }}
            fontWeight="700"
            color="gray.800"
            lineHeight="1.2"
            mb={'10px'}
          >
            Cart Items
          </Text>
        </Flex>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="400px"
          >
            <VStack spacing="16px">
              <Box
                w="48px"
                h="48px"
                border="4px solid"
                borderColor="gray.200"
                borderTopColor="#FF6B35"
                borderRadius="full"
                animation="spin 1s linear infinite"
                sx={{
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              <Text
                fontSize="18px"
                color="gray.600"
              >
                {t.pleaseWait || 'Getting best prices...'}
              </Text>
            </VStack>
          </Box>
        ) : (
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap="16px"
          >
            {/* Cart Items */}
            <Box
              flex="1"
              bg="white"
              borderRadius="16px"
              p="16px"
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="gray.800"
                mb="12px"
              >
                {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
              </Text>

              <VStack
                spacing="12px"
                align="stretch"
              >
                {items.map((item, idx) => (
                  <Box key={item.id}>
                    <Flex
                      direction="row"
                      gap="10px"
                      align="center"
                      justifyContent="flex-start"
                    >
                      {/* Item Image */}
                      <Box
                        position="relative"
                        w="80px"
                        h="80px"
                        borderRadius="10px"
                        overflow="hidden"
                        bg="gray.100"
                        flexShrink={0}
                      >
                        <Image
                          src={item.images?.[0]?.url || '/images/food-placeholder.svg'}
                          alt={item.name}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          fallback={
                            <Flex
                              h="100%"
                              align="center"
                              justify="center"
                              color="gray.400"
                              fontSize="24px"
                            >
                              🍽️
                            </Flex>
                          }
                        />
                      </Box>

                      <VStack w="100%">
                        <HStack w="100%">
                          {/* Item Details */}
                          <VStack
                            align="start"
                            spacing="4px"
                            flex="1"
                            minW="0"
                            w="100%"
                          >
                            <Text
                              fontSize="15px"
                              fontWeight="700"
                              color="gray.800"
                              noOfLines={1}
                              lineHeight="1.3"
                            >
                              {item.name}
                            </Text>
                            {item.providerName && (
                              <Text
                                fontSize="12px"
                                color="gray.500"
                                noOfLines={1}
                              >
                                {item.providerName}
                              </Text>
                            )}
                          </VStack>

                          {/* Quantity Controls */}
                          <HStack
                            spacing="6px"
                            border="1px solid #FF6B35"
                            borderRadius="8px"
                            p="2px"
                            align="center"
                            flexShrink={0}
                          >
                            <IconButton
                              aria-label="Decrease"
                              icon={<FiMinus />}
                              size="xs"
                              onClick={() => handleDecrement(item.id)}
                              bg="white"
                              color="#FF6B35"
                              _hover={{ bg: 'gray.50' }}
                              h="24px"
                              w="24px"
                              minW="24px"
                              mb="0"
                            />
                            <Text
                              fontSize="14px"
                              fontWeight="700"
                              color="#FF6B35"
                              minW="20px"
                              textAlign="center"
                            >
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase"
                              icon={<FiPlus />}
                              size="xs"
                              onClick={() => handleIncrement(item.id)}
                              bg="white"
                              color="#FF6B35"
                              _hover={{ bg: 'gray.50' }}
                              h="24px"
                              w="24px"
                              minW="24px"
                              mb="0"
                            />
                          </HStack>
                        </HStack>
                        <Text
                          fontSize="14px"
                          fontWeight="700"
                          color="#FF6B35"
                          lineHeight="1.2"
                          alignSelf="flex-start"
                          w="100%"
                        >
                          {item.price.currency === 'INR' ? '₹' : item.price.currency}
                          {item.price.value} × {item.quantity} ={' '}
                          {item.price.currency === 'INR' ? '₹' : item.price.currency}
                          {(Number(item.price.value) * item.quantity).toFixed(2)}
                        </Text>
                      </VStack>
                    </Flex>
                    {idx < items.length - 1 && <Divider mt="12px" />}
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Order Summary */}
            <Box
              w={{ base: '100%', lg: '350px' }}
              bg="white"
              borderRadius="16px"
              p="16px"
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
              h="fit-content"
              position={{ base: 'relative', lg: 'sticky' }}
              top="24px"
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="gray.800"
                mb="12px"
              >
                {t.orderSummary || 'Order Summary'}
              </Text>

              <VStack
                spacing="12px"
                align="stretch"
                mb="16px"
              >
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Text
                    fontSize="14px"
                    color="gray.600"
                  >
                    {t.totalQuantity || 'Total Items'}
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="gray.800"
                  >
                    {totalQuantity}
                  </Text>
                </Flex>

                <Divider />

                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Text
                    fontSize="16px"
                    fontWeight="700"
                    color="gray.800"
                  >
                    {t.totalAmount || 'Total Amount'}
                  </Text>
                  {isLoading ? (
                    <Text
                      fontSize="14px"
                      color="gray.500"
                      fontStyle="italic"
                    >
                      Calculating...
                    </Text>
                  ) : (
                    <Text
                      fontSize="20px"
                      fontWeight="800"
                      color="#FF6B35"
                    >
                      {quote?.price.currency === 'INR' ? '₹' : quote?.price.currency || '₹'}
                      {quote?.price.value ||
                        items.reduce((sum, item) => sum + Number(item.price.value) * item.quantity, 0).toFixed(2)}
                    </Text>
                  )}
                </Flex>
              </VStack>

              <Button
                w="100%"
                bg="#FF6B35"
                color="white"
                size="md"
                borderRadius="12px"
                fontSize="16px"
                fontWeight="700"
                py="16px"
                onClick={onOrderClick}
                isDisabled={items.length === 0 || isLoading}
                isLoading={isLoading}
                loadingText="Calculating..."
                _hover={{
                  bg: '#E55A2B',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
                }}
                _active={{ bg: '#CC4F24' }}
                _disabled={{
                  bg: 'gray.300',
                  cursor: 'not-allowed',
                  _hover: { bg: 'gray.300', transform: 'none' }
                }}
              >
                {t.order || 'Proceed to Checkout'}
              </Button>
            </Box>
          </Flex>
        )}
      </Container>
    </Box>
  )
}

export default Cart
