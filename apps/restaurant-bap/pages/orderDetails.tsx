import React, { useEffect, useState, Fragment, useRef } from 'react'
import axios from '@services/axios'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Flex,
  IconButton,
  Badge,
  Divider,
  Collapse,
  Button
} from '@chakra-ui/react'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import {
  createPaymentBreakdownMap,
  getItemWiseBreakUp,
  getTotalPriceWithCurrency,
  formatTimestamp
} from '@beckn-ui/common/src/utils'
import { useLanguage } from '@hooks/useLanguage'
import { ConfirmResponseModel, StatusResponseModel, StatusKey, statusMap, Item } from '@beckn-ui/common/lib/types'
import { OrdersRootState } from '@beckn-ui/common/src/store/order-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { DOMAIN } from '@lib/config'
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiMapPin, FiPhone, FiUser, FiCheckCircle } from 'react-icons/fi'
import { CurrencyType } from '@beckn-ui/becknified-components'
import { formatCurrency } from '@beckn-ui/becknified-components/src/components/product-price/product-price'
import ItemDetails from '@components/checkout/ItemDetails'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import OrderStatusProgress from '@components/orderStatusProgress/OrderStatusProgress'

const statusDisplayMap: Record<string, { label: string; color: string; bg: string }> = {
  ORDER_RECEIVED: { label: 'Order Received', color: '#B8860B', bg: '#FFF9CC' },
  ORDER_DISPATCHED: { label: 'Order Dispatched', color: '#3182CE', bg: '#BEE3F8' },
  COMPLETE: { label: 'Delivered', color: '#38A169', bg: '#C6F6D5' },
  'USER CANCELLED': { label: 'Cancelled', color: '#E53E3E', bg: '#FED7D7' }
}

interface OrderStatus {
  label: string
  statusTime?: string
  lastElement?: boolean
}

const OrderDetails = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [statusData, setStatusData] = useState<StatusResponseModel[]>([])
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[] | null>(null)
  const [isAddressOpen, setIsAddressOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(true)
  const [orderStatusMap, setOrderStatusMap] = useState<OrderStatus[]>([])
  const [isError, setIsError] = useState(false)

  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const orderMetaData = useSelector((state: OrdersRootState) => state.orders.selectedOrderDetails)
  const dispatch = useDispatch()
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      try {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        setConfirmData(parsedConfirmData)
      } catch (error) {
        console.error('Error parsing confirm response:', error)
        // Clear invalid data from localStorage
        localStorage.removeItem('confirmResponse')
      }
    }
  }, [])

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true

    const fetchData = async () => {
      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) return

      try {
        if (isMountedRef.current) {
          setIsLoading(true)
        }

        let statusPayload
        if (localStorage.getItem('selectedOrder')) {
          try {
            const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
            const { bppId, bppUri, orderId } = selectedOrderData
            statusPayload = {
              data: [
                {
                  context: {
                    transaction_id: uuidv4(),
                    bpp_id: bppId,
                    bpp_uri: bppUri,
                    domain: DOMAIN
                  },
                  message: {
                    order_id: orderId,
                    orderId: orderId
                  }
                }
              ]
            }
          } catch (error) {
            console.error('Error parsing selected order data:', error)
            // Clear invalid data from localStorage
            localStorage.removeItem('selectedOrder')
            if (isMountedRef.current) {
              setIsError(true)
              setIsLoading(false)
            }
            return
          }
        } else if (confirmData?.length) {
          const { bpp_id, bpp_uri, domain } = confirmData[0].context
          const orderId = confirmData[0].message.orderId
          statusPayload = {
            data: [
              {
                context: {
                  transaction_id: uuidv4(),
                  bpp_id,
                  bpp_uri,
                  domain
                },
                message: {
                  order_id: orderId,
                  orderId: orderId
                }
              }
            ]
          }
        } else {
          if (isMountedRef.current) {
            setIsLoading(false)
          }
          return
        }

        // Check again before making API call
        if (!isMountedRef.current) return

        const response = await axios.post(`${apiUrl}/status`, statusPayload)

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return

        if (
          JSON.stringify(response.data) === '{}' ||
          response.data?.data?.length === 0 ||
          !response.data?.data?.[0]?.message
        ) {
          setIsError(true)
          setIsLoading(false)
          return
        }

        setStatusData(response.data.data)
        localStorage.setItem('statusResponse', JSON.stringify(response.data.data))
      } catch (error) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          console.error('Error fetching order status:', error)
          setIsError(true)
          setIsLoading(false)
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        fetchData()
      }
    }, 30000)

    // Cleanup function
    return () => {
      isMountedRef.current = false
      clearInterval(intervalId)
      // Cancel any ongoing requests if AbortController is available
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [apiUrl, confirmData])

  // Build order status map for fulfillment details - following retail app logic
  useEffect(() => {
    if (statusData.length > 0) {
      const newData = statusData
        .map((status: StatusResponseModel) => {
          const order = status?.message?.order
          const tags = order?.tags
          const fulfillmentState = order?.fulfillments?.[0]?.state?.descriptor?.code

          let statusKey: string | undefined
          if (tags && tags.length > 0) {
            const lastTag = tags[tags.length - 1]
            if (lastTag?.list?.[0]?.value) {
              statusKey = lastTag.list[0].value
            }
          } else if (fulfillmentState) {
            statusKey = fulfillmentState
          }

          return {
            label: statusKey,
            statusTime: order?.fulfillments?.[0]?.state?.updated_at || status?.context?.timestamp
          }
        })
        .filter(status => status.label)

      // Get the current status from newData
      const currentStatus = newData[newData.length - 1]?.label

      // Map API statuses to display statuses and define what to show for each
      let statusesToShow: string[] = []

      if (currentStatus === 'ORDER_RECEIVED') {
        statusesToShow = ['ORDER_RECEIVED']
      } else if (currentStatus === 'ORDER_DISPATCHED') {
        statusesToShow = ['ORDER_RECEIVED', 'ORDER_DISPATCHED']
      } else if (currentStatus === 'COMPLETE') {
        statusesToShow = ['ORDER_RECEIVED', 'ORDER_DISPATCHED', 'COMPLETE']
      } else if (currentStatus === 'USER CANCELLED') {
        statusesToShow = ['USER CANCELLED']
      } else {
        // Fallback to show just the current status
        statusesToShow = [currentStatus || '']
      }

      // Create the complete sequence with the statuses to show
      const completeSequence = statusesToShow.map((status: string, index: number) => {
        // Find if this status already exists in statusMap
        const existingStatus = statusMap[status as StatusKey]
        if (existingStatus) {
          return {
            label: existingStatus,
            lastElement: status === 'COMPLETE' || status === 'USER CANCELLED',
            statusTime: newData[newData.length - 1]?.statusTime
          }
        } else {
          // For new statuses, use the current status time or generate a time
          const statusTime =
            index === statusesToShow.length - 1
              ? newData[newData.length - 1]?.statusTime
              : new Date(Date.now() - (statusesToShow.length - 1 - index) * 60000).toISOString() // Approximate time

          return {
            label: status,
            lastElement: status === 'COMPLETE' || status === 'USER CANCELLED',
            statusTime: statusTime
          }
        }
      })

      // Update the orderStatusMap with the complete sequence
      setOrderStatusMap(completeSequence as OrderStatus[])
    }
  }, [statusData])

  if (isLoading) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait || 'Please wait'}
          loadingSubText={'Fetching order details...'}
        />
      </Box>
    )
  }

  if (isError || !statusData?.[0]?.message) {
    dispatch(
      feedbackActions.setToastData({
        toastData: {
          message: 'Error',
          display: true,
          type: 'error',
          description: 'Unable to fetch order details'
        }
      })
    )
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <VStack spacing="16px">
          <Text
            fontSize="18px"
            color="gray.600"
          >
            Unable to load order details
          </Text>
          <Button
            colorScheme="orange"
            onClick={() => router.push('/orderHistory')}
          >
            Back to Orders
          </Button>
        </VStack>
      </Box>
    )
  }

  const { order } = statusData[0].message
  const { created_at, billing, fulfillments, items } = order
  const currentStatus = fulfillments?.[0]?.state?.descriptor?.code || 'ORDER_RECEIVED'
  const statusInfo = statusDisplayMap[currentStatus] || statusDisplayMap['ORDER_RECEIVED']

  const shippingInfo = {
    name: fulfillments?.[0]?.customer?.person?.name || fulfillments?.[0]?.stops?.[0]?.contact?.name || '',
    phone: fulfillments?.[0]?.customer?.contact?.phone || fulfillments?.[0]?.stops?.[0]?.contact?.phone || '',
    address: fulfillments?.[0]?.stops?.[0]?.location?.address || ''
  }

  const paymentBreakdownMap = createPaymentBreakdownMap(statusData)
  // Convert the payment breakdown object to an array format
  // Fallback to direct breakup array from API if paymentBreakdownMap is empty
  // Aggregate values by title in fallback to handle multiple items
  const paymentBreakdown =
    paymentBreakdownMap && Object.keys(paymentBreakdownMap).length > 0
      ? Object.entries(paymentBreakdownMap).map(([title, price]) => ({
          title,
          value: parseFloat(price.value || '0').toFixed(2)
        }))
      : (() => {
          // Aggregate breakup items by title
          const aggregatedMap: Record<string, number> = {}
          order?.quote?.breakup?.forEach(item => {
            const title = item.title || ''
            const value = parseFloat(item.price?.value || '0')
            aggregatedMap[title] = (aggregatedMap[title] || 0) + value
          })
          return Object.entries(aggregatedMap).map(([title, value]) => ({
            title,
            value: value.toFixed(2)
          }))
        })() || []
  const totalPrice = getTotalPriceWithCurrency(statusData)

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
            Order Details
          </Text>
        </Flex>

        <VStack
          spacing="16px"
          align="stretch"
        >
          {/* Order Overview */}
          <Box
            bg="white"
            borderRadius="16px"
            p={{ base: '16px', md: '24px' }}
            boxShadow="0 2px 8px rgba(0,0,0,0.08)"
          >
            <Flex
              justify="space-between"
              align="start"
              mb="16px"
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="gray.800"
              >
                Order Overview
              </Text>
              <Badge
                bg={statusInfo.bg}
                color={statusInfo.color}
                px="12px"
                py="4px"
                borderRadius="8px"
                fontWeight="600"
              >
                {statusInfo.label}
              </Badge>
            </Flex>
            <VStack
              align="stretch"
              spacing="8px"
            >
              <Flex justify="space-between">
                <Text color="gray.600">Order ID</Text>
                <Text
                  fontWeight="600"
                  maxW="200px"
                  isTruncated
                >
                  {orderMetaData?.orderIds?.[0] || order?.id}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.600">Placed at</Text>
                <Text fontWeight="600">{formatTimestamp(created_at)}</Text>
              </Flex>
            </VStack>
          </Box>

          {/* Item Details with Accordion */}
          <Box
            bg="white"
            borderRadius="16px"
            p={{ base: '16px', md: '24px' }}
            boxShadow="0 2px 8px rgba(0,0,0,0.08)"
          >
            <Text
              fontSize="18px"
              fontWeight="700"
              color="gray.800"
              mb="16px"
            >
              Items ({items?.length || 0})
            </Text>
            <Box>
              {items?.map((item: Item, idx: number) => {
                const itemBreakup = getItemWiseBreakUp(statusData, item.id)
                return (
                  <Fragment key={item.id || idx}>
                    <DetailsCard>
                      <ItemDetails
                        title={item.name}
                        description={item.short_desc}
                        quantity={
                          typeof item.quantity === 'object' && item.quantity !== null
                            ? (item.quantity as { selected?: { count?: number }; count?: number })?.selected?.count ||
                              (item.quantity as { count?: number })?.count ||
                              1
                            : typeof item.quantity === 'number'
                              ? item.quantity
                              : 1
                        }
                        price={Number(itemBreakup.totalPricewithCurrent?.value || item.price?.value || 0)}
                        currency={item.price?.currency || 'INR'}
                        image={item.images?.[0]?.url}
                        breakUp={itemBreakup.paymentBreakdownMap}
                      />
                    </DetailsCard>
                    {idx < items.length - 1 && (
                      <Divider
                        color="#BFBFBF"
                        my="16px"
                        border="0.5px solid #BFBFBF"
                        opacity={0.5}
                      />
                    )}
                  </Fragment>
                )
              })}
            </Box>
          </Box>

          {/* Fulfillment Details */}
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 2px 8px rgba(0,0,0,0.08)"
            overflow="hidden"
          >
            <Flex
              p={{ base: '16px', md: '20px' }}
              justify="space-between"
              align="center"
              cursor="pointer"
              onClick={() => setIsFulfillmentOpen(!isFulfillmentOpen)}
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="gray.800"
              >
                Fulfillment Details
              </Text>
              {isFulfillmentOpen ? <FiChevronUp /> : <FiChevronDown />}
            </Flex>
            <Collapse in={isFulfillmentOpen}>
              <Box
                px={{ base: '16px', md: '20px' }}
                pb={{ base: '16px', md: '20px' }}
              >
                <Divider mb="16px" />
                <Box className="order_status_progress">
                  {orderStatusMap.map((status: OrderStatus, index: number) => (
                    <OrderStatusProgress
                      key={index}
                      label={status.label}
                      statusTime={status.statusTime ? formatTimestamp(status.statusTime) : ''}
                      noLine={status.lastElement || false}
                      lastElement={status.lastElement || false}
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Delivery Address - Collapsible */}
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 2px 8px rgba(0,0,0,0.08)"
            overflow="hidden"
          >
            <Flex
              p={{ base: '16px', md: '20px' }}
              justify="space-between"
              align="center"
              cursor="pointer"
              onClick={() => setIsAddressOpen(!isAddressOpen)}
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                color="gray.800"
              >
                Delivery & Billing
              </Text>
              {isAddressOpen ? <FiChevronUp /> : <FiChevronDown />}
            </Flex>
            <Collapse in={isAddressOpen}>
              <Box
                px={{ base: '16px', md: '20px' }}
                pb={{ base: '16px', md: '20px' }}
              >
                <Divider mb="16px" />
                {/* Shipping */}
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color="gray.500"
                  mb="12px"
                >
                  DELIVERY ADDRESS
                </Text>
                <VStack
                  align="start"
                  spacing="8px"
                  mb="20px"
                >
                  <HStack>
                    <FiUser color="#718096" />
                    <Text>{shippingInfo.name}</Text>
                  </HStack>
                  <HStack>
                    <FiMapPin color="#718096" />
                    <Text
                      fontSize="14px"
                      color="gray.600"
                    >
                      {typeof shippingInfo.address === 'string'
                        ? shippingInfo.address
                        : typeof shippingInfo.address === 'object' &&
                            shippingInfo.address !== null &&
                            'full' in shippingInfo.address
                          ? (shippingInfo.address as { full: string }).full
                          : 'Address not available'}
                    </Text>
                  </HStack>
                  <HStack>
                    <FiPhone color="#718096" />
                    <Text>{shippingInfo.phone}</Text>
                  </HStack>
                </VStack>

                {/* Billing */}
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color="gray.500"
                  mb="12px"
                >
                  BILLING ADDRESS
                </Text>
                <VStack
                  align="start"
                  spacing="8px"
                >
                  <HStack>
                    <FiUser color="#718096" />
                    <Text>{billing?.name}</Text>
                  </HStack>
                  <HStack>
                    <FiMapPin color="#718096" />
                    <Text
                      fontSize="14px"
                      color="gray.600"
                    >
                      {billing?.address}
                    </Text>
                  </HStack>
                  <HStack>
                    <FiPhone color="#718096" />
                    <Text>{billing?.phone}</Text>
                  </HStack>
                </VStack>
              </Box>
            </Collapse>
          </Box>

          {/* Payment - Collapsible */}
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 2px 8px rgba(0,0,0,0.08)"
            overflow="hidden"
          >
            <Flex
              p={{ base: '16px', md: '20px' }}
              justify="space-between"
              align="center"
              cursor="pointer"
              onClick={() => setIsPaymentOpen(!isPaymentOpen)}
            >
              <HStack>
                <Text
                  fontSize="18px"
                  fontWeight="700"
                  color="gray.800"
                >
                  Payment
                </Text>
                <Badge
                  bg="#C6F6D5"
                  color="#38A169"
                  px="8px"
                  py="2px"
                  borderRadius="6px"
                  fontSize="10px"
                >
                  <HStack spacing="4px">
                    <FiCheckCircle size="10px" />
                    <Text>PAID</Text>
                  </HStack>
                </Badge>
              </HStack>
              {isPaymentOpen ? <FiChevronUp /> : <FiChevronDown />}
            </Flex>
            <Collapse in={isPaymentOpen}>
              <Box
                px={{ base: '16px', md: '20px' }}
                pb={{ base: '16px', md: '20px' }}
              >
                <Divider mb="16px" />
                <VStack
                  spacing="12px"
                  align="stretch"
                >
                  {paymentBreakdown.map((item, idx) => (
                    <Flex
                      key={idx}
                      justify="space-between"
                    >
                      <Text color="gray.600">{item.title}</Text>
                      <Text fontWeight="500">
                        {formatCurrency(
                          Number(item.value),
                          (typeof totalPrice === 'object' && totalPrice.currency
                            ? (totalPrice.currency as CurrencyType)
                            : 'INR') || 'INR'
                        )}
                      </Text>
                    </Flex>
                  ))}
                  <Divider />
                  <Flex justify="space-between">
                    <Text
                      fontSize="14px"
                      fontWeight="500"
                    >
                      Total
                    </Text>
                    <Text
                      fontSize="20px"
                      fontWeight="800"
                      color="#FF6B35"
                    >
                      {formatCurrency(
                        typeof totalPrice === 'object' ? Number(totalPrice.value) : Number(totalPrice),
                        (typeof totalPrice === 'object' && totalPrice.currency
                          ? (totalPrice.currency as CurrencyType)
                          : 'INR') || 'INR'
                      )}
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            </Collapse>
          </Box>

          {/* Back to Orders Button */}
          <Button
            w="100%"
            bg="#FF6B35"
            color="white"
            size="lg"
            borderRadius="12px"
            onClick={() => router.push('/orderHistory')}
            _hover={{ bg: '#E55A2B' }}
          >
            Back to My Orders
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default OrderDetails
