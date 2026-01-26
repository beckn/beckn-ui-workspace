import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Box, Container, Text, VStack, Flex, IconButton, Badge, Image } from '@chakra-ui/react'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import { orderHistoryData } from '@beckn-ui/common/lib/types'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { useLanguage } from '@hooks/useLanguage'
import { FiArrowLeft, FiPackage, FiShoppingBag } from 'react-icons/fi'
import { ORDER_CATEGORY_ID } from '../lib/config'

const orderStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  // Pending/Processing statuses
  'In Review': { label: 'Pending', color: '#B8860B', bg: '#FFF9CC' },
  ORDER_RECEIVED: { label: 'Received', color: '#B8860B', bg: '#FFF9CC' },
  ArrangingPayment: { label: 'Processing Payment', color: '#B8860B', bg: '#FFF9CC' },
  PaymentSettled: { label: 'Payment Settled', color: '#3182CE', bg: '#BEE3F8' },
  IN_PROGRESS: { label: 'In Progress', color: '#B8860B', bg: '#FFF9CC' },

  // Active/Shipping statuses
  ORDER_DISPATCHED: { label: 'Dispatched', color: '#3182CE', bg: '#BEE3F8' },
  Shipped: { label: 'Shipped', color: '#3182CE', bg: '#BEE3F8' },

  // Completed statuses
  ORDER_DELIVERED: { label: 'Delivered', color: '#38A169', bg: '#C6F6D5' },
  Delivered: { label: 'Delivered', color: '#38A169', bg: '#C6F6D5' },
  COMPLETE: { label: 'Completed', color: '#38A169', bg: '#C6F6D5' },

  // Cancelled statuses
  ORDER_CANCELLED: { label: 'Cancelled', color: '#E53E3E', bg: '#FED7D7' },
  'USER CANCELLED': { label: 'Cancelled', color: '#E53E3E', bg: '#FED7D7' },
  Cancelled: { label: 'Cancelled', color: '#E53E3E', bg: '#FED7D7' },

  // Default fallback for unknown statuses
  DEFAULT: { label: 'Processing', color: '#718096', bg: '#EDF2F7' }
}

// Helper function to get status info with fallback
const getStatusInfo = (status: string | null | undefined) => {
  if (!status) return orderStatusMap.DEFAULT

  const normalizedStatus = status.trim()

  // Try exact match first
  if (orderStatusMap[normalizedStatus]) {
    return orderStatusMap[normalizedStatus]
  }

  // Try uppercase match
  const upperStatus = normalizedStatus.toUpperCase()
  if (orderStatusMap[upperStatus]) {
    return orderStatusMap[upperStatus]
  }

  // Try to find partial matches for common patterns
  if (normalizedStatus.includes('CANCELLED') || normalizedStatus.includes('CANCEL')) {
    return orderStatusMap.ORDER_CANCELLED
  }
  if (normalizedStatus.includes('DELIVERED') || normalizedStatus.includes('DELIVER')) {
    return orderStatusMap.ORDER_DELIVERED
  }
  if (normalizedStatus.includes('DISPATCHED') || normalizedStatus.includes('DISPATCH')) {
    return orderStatusMap.ORDER_DISPATCHED
  }
  if (normalizedStatus.includes('COMPLETE') || normalizedStatus.includes('COMPLETED')) {
    return orderStatusMap.COMPLETE
  }
  if (normalizedStatus.includes('RECEIVED') || normalizedStatus.includes('RECEIVE')) {
    return orderStatusMap.ORDER_RECEIVED
  }

  // Default fallback
  return orderStatusMap.DEFAULT
}

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(`${strapiUrl}/orders?filters[category]=${ORDER_CATEGORY_ID}&sort[0]=updatedAt:desc`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          return setError(result.error.message)
        }
        setOrderHistoryList(result.data || [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching order history:', error)
        setIsLoading(false)
        const errorMessage = error?.message || 'Failed to load order history. Please try again later.'
        setError(errorMessage)
      })
      .finally(() => setIsLoading(false))
  }, [bearerToken, strapiUrl])

  const handleOrderClick = (order: orderHistoryData) => {
    const orderObjectForStatusCall = {
      bppId: order.attributes.bpp_id,
      bppUri: order.attributes.bpp_uri,
      orderId: order.attributes.order_id
    }
    localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
    dispatch(orderActions.addSelectedOrder({ orderDetails: orderObjectForStatusCall }))
    router.push('/orderDetails')
  }

  if (isLoading) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait || 'Please wait'}
          loadingSubText=""
        />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <Text
          fontWeight={500}
          fontSize="15px"
          textAlign="center"
          color="red.500"
        >
          {error}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '16px', md: '24px' }}
    >
      <Container
        maxW="800px"
        px={{ base: '16px', md: '24px' }}
      >
        {/* Header */}
        <Flex align="center">
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft size="24px" />}
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
            My Orders
          </Text>
        </Flex>

        {!orderHistoryList.length ? (
          <VStack
            spacing="24px"
            py="80px"
            align="center"
          >
            <Box fontSize="80px">📦</Box>
            <Text
              fontSize="24px"
              fontWeight="700"
              color="gray.800"
            >
              No orders yet
            </Text>
            <Text
              fontSize="16px"
              color="gray.600"
              textAlign="center"
            >
              Start ordering delicious food and your orders will appear here
            </Text>
            <Box
              as="button"
              bg="#FF6B35"
              color="white"
              px="32px"
              py="16px"
              borderRadius="12px"
              fontWeight="700"
              display="flex"
              alignItems="center"
              gap="8px"
              onClick={() => router.push('/')}
              _hover={{ bg: '#E55A2B' }}
            >
              <FiShoppingBag /> Start Ordering
            </Box>
          </VStack>
        ) : (
          <VStack
            spacing="16px"
            align="stretch"
          >
            {orderHistoryList.map((order, idx) => {
              const status = order.attributes.delivery_status
              const statusInfo = getStatusInfo(status)

              return (
                <Box
                  key={idx}
                  bg="white"
                  borderRadius="16px"
                  p={{ base: '16px', md: '20px' }}
                  boxShadow="0 2px 8px rgba(0,0,0,0.08)"
                  cursor="pointer"
                  transition="all 0.2s"
                  onClick={() => handleOrderClick(order)}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                  }}
                >
                  <Flex
                    justify="space-between"
                    align="start"
                    mb="12px"
                  >
                    <VStack
                      align="start"
                      spacing="4px"
                    >
                      <Text
                        fontSize="12px"
                        color="gray.500"
                      >
                        {formatTimestamp(order.attributes.createdAt)}
                      </Text>
                      <Text
                        fontSize="14px"
                        color="gray.700"
                        fontWeight="500"
                        maxW={{ base: '200px', md: 'none' }}
                        isTruncated
                      >
                        Order ID: {order.attributes.order_id}
                      </Text>
                    </VStack>
                    <Badge
                      bg={statusInfo.bg}
                      color={statusInfo.color}
                      px="12px"
                      py="4px"
                      borderRadius="8px"
                      fontWeight="600"
                      fontSize="12px"
                    >
                      {statusInfo.label}
                    </Badge>
                  </Flex>

                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Flex
                      align="center"
                      gap="8px"
                    >
                      <FiPackage color="#718096" />
                      <Text
                        fontSize="14px"
                        color="gray.600"
                      >
                        {order.attributes?.items?.length || 0} Items
                      </Text>
                    </Flex>
                    <Text
                      fontSize="18px"
                      fontWeight="700"
                      color="#FF6B35"
                    >
                      {order.attributes.quote?.price?.currency === 'INR'
                        ? '₹'
                        : order.attributes.quote?.price?.currency}
                      {Number(order.attributes.quote?.price?.value || 0).toFixed(2)}
                    </Text>
                  </Flex>
                </Box>
              )
            })}
          </VStack>
        )}
      </Container>
    </Box>
  )
}

export default OrderHistory
