import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Radio,
  RadioGroup,
  Flex,
  Image,
  IconButton
} from '@chakra-ui/react'
import { FiCreditCard, FiSmartphone, FiDollarSign, FiArrowRight, FiCheck, FiArrowLeft } from 'react-icons/fi'

const PaymentMode = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<string>('')

  const paymentMethods = [
    {
      category: 'Credit & Debit Cards',
      items: [
        {
          id: 'visa',
          name: 'Visa Card',
          icon: '/images/visa.svg',
          disabled: true
        },
        {
          id: 'mastercard',
          name: 'Mastercard',
          icon: '/images/masterCard.svg',
          disabled: true
        }
      ]
    },
    {
      category: 'UPI',
      items: [
        {
          id: 'phonepe',
          name: 'PhonePe UPI',
          icon: '/images/phonePayPayment.svg',
          disabled: true
        }
      ]
    },
    {
      category: 'Other',
      items: [
        {
          id: 'cod',
          name: 'Cash on Delivery',
          icon: '/images/cash.svg',
          disabled: false
        }
      ]
    }
  ]

  const handleOrderConfirmation = () => {
    if (selectedPayment) {
      router.push('/orderConfirmation')
    }
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      bg="gray.50"
    >
      <Container
        maxW={{ base: '100%', md: '600px' }}
        px={{ base: '16px', md: '24px' }}
        py="20px"
      >
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
            Payment Method
          </Text>
        </Flex>

        {/* Payment Methods */}
        <VStack
          spacing="24px"
          align="stretch"
          pb="100px"
        >
          {paymentMethods.map((category, catIdx) => (
            <Box key={catIdx}>
              {/* Category Header */}
              <Flex
                justify="space-between"
                align="center"
                mb="12px"
              >
                <Text
                  fontSize="15px"
                  fontWeight="600"
                  color="gray.700"
                >
                  {category.category}
                </Text>
                {category.category !== 'Other' && (
                  <Text
                    fontSize="13px"
                    color="gray.400"
                    fontWeight="500"
                  >
                    Coming Soon
                  </Text>
                )}
              </Flex>

              {/* Payment Options */}
              <Box
                bg="white"
                borderRadius="12px"
                boxShadow="0 2px 8px rgba(0,0,0,0.06)"
                overflow="hidden"
              >
                {category.items.map((item, idx) => (
                  <Box
                    key={item.id}
                    px="16px"
                    py="14px"
                    borderBottom={idx < category.items.length - 1 ? '1px solid' : 'none'}
                    borderColor="gray.100"
                    cursor={item.disabled ? 'not-allowed' : 'pointer'}
                    opacity={item.disabled ? 0.5 : 1}
                    bg={selectedPayment === item.id ? '#FFF5F2' : 'white'}
                    transition="all 0.2s"
                    _hover={!item.disabled ? { bg: '#FFF5F2' } : {}}
                    onClick={() => !item.disabled && setSelectedPayment(item.id)}
                  >
                    <Flex
                      align="center"
                      justify="space-between"
                    >
                      <HStack spacing="12px">
                        <Radio
                          value={item.id}
                          isChecked={selectedPayment === item.id}
                          isDisabled={item.disabled}
                          colorScheme="orange"
                          size="lg"
                          onChange={() => !item.disabled && setSelectedPayment(item.id)}
                        />
                        <Box
                          w="40px"
                          h="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image
                            src={item.icon}
                            alt={item.name}
                            maxH="24px"
                            maxW="36px"
                            objectFit="contain"
                            fallback={
                              <Box
                                w="36px"
                                h="24px"
                                bg="gray.100"
                                borderRadius="4px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {item.id === 'cod' ? (
                                  <FiDollarSign
                                    color="#666"
                                    size="16px"
                                  />
                                ) : item.id.includes('visa') || item.id.includes('master') ? (
                                  <FiCreditCard
                                    color="#666"
                                    size="16px"
                                  />
                                ) : (
                                  <FiSmartphone
                                    color="#666"
                                    size="16px"
                                  />
                                )}
                              </Box>
                            }
                          />
                        </Box>
                        <Text
                          fontSize="15px"
                          fontWeight="500"
                          color="gray.800"
                        >
                          {item.name}
                        </Text>
                      </HStack>
                      {selectedPayment === item.id && (
                        <Box
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          bg="#FF6B35"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <FiCheck
                            color="white"
                            size="12px"
                          />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </VStack>

        {/* Fixed Bottom Button */}
        <Box
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          bg="white"
          p="16px"
          boxShadow="0 -4px 20px rgba(0,0,0,0.1)"
        >
          <Container maxW={{ base: '100%', md: '600px' }}>
            <Button
              w="100%"
              bg={selectedPayment ? '#FF6B35' : 'gray.300'}
              color="white"
              size="lg"
              borderRadius="12px"
              fontSize="16px"
              fontWeight="700"
              py="24px"
              rightIcon={<FiArrowRight />}
              onClick={handleOrderConfirmation}
              isDisabled={!selectedPayment}
              _hover={{
                bg: selectedPayment ? '#E55A2B' : 'gray.300'
              }}
              _disabled={{
                bg: 'gray.300',
                cursor: 'not-allowed'
              }}
            >
              {'Confirm Order'}
            </Button>
          </Container>
        </Box>
      </Container>
    </Box>
  )
}

export default PaymentMode
