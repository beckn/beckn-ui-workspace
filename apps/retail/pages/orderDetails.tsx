import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import Router, { useRouter } from 'next/router'
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useTheme
} from '@chakra-ui/react'
import { Accordion, BottomModal, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import ViewMoreOrderModal from '@components/orderDetailComponents/ViewMoreOrder'
import {
  DetailCard,
  ItemDetailProps,
  OrderStatusProgress,
  OrderStatusProgressProps
} from '@beckn-ui/becknified-components'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import {
  createPaymentBreakdownMap,
  getItemWiseBreakUp,
  getTotalPriceWithCurrency,
  isEmpty
} from '@beckn-ui/common/src/utils'
import { useLanguage } from '@hooks/useLanguage'
import { getPayloadForOrderStatus, formatTimestamp } from '@beckn-ui/common/src/utils'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
import ShippingBlock from '@components/orderDetailComponents/Shipping'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import {
  ConfirmResponseModel,
  DataState,
  Item,
  OrderStatus,
  ProcessState,
  QuantityDetails,
  StatusKey,
  statusMap,
  StatusResponseModel,
  UIState
} from '@beckn-ui/common/lib/types'
import { statusActions } from '@beckn-ui/common/src/store/status-slice'
import { OrdersRootState } from '@beckn-ui/common/src/store/order-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { DOMAIN } from '@lib/config'
import { testIds } from '@shared/dataTestIds'
import successIcon from '@public/images/order_complete.svg'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ItemDetails from '@beckn-ui/becknified-components/src/components/checkout/checkout-item-details'

const CANCELLED = 'CANCELLED'

interface MenuItem {
  image: string
  text: string | React.ReactNode
  onClick: () => void
}

// Constants
const ORDER_CANCEL_REASONS = [
  { id: 1, reason: 'Merchant is taking too long' },
  { id: 2, reason: 'Ordered by mistake' },
  { id: 3, reason: 'I’ve changed my mind' },
  { id: 4, reason: 'Other' }
]

// order statuses
type ParentStatus = 'ORDER_RECEIVED' | 'COMPLETE' | 'USER CANCELLED' | 'ORDER_DISPATCHED'

const parentStatusMap: Record<
  ParentStatus,
  { borderColor: string; bgColor: string; color: string; icon: string | undefined; label: string }
> = {
  ORDER_RECEIVED: {
    borderColor: '#F0D402',
    bgColor: '#FFF9CC',
    color: '#807000',
    icon: undefined,
    label: 'In Progress'
  },
  COMPLETE: { borderColor: '#C0F7E2', bgColor: '#D2F9EA', color: '#11704C', icon: successIcon, label: 'Completed' },
  'USER CANCELLED': {
    borderColor: '#E93324',
    bgColor: '#FFD2D2',
    color: '#E93324',
    icon: undefined,
    label: 'Cancelled'
  },
  ORDER_DISPATCHED: {
    borderColor: '#F0D402',
    bgColor: '#FFF9CC',
    color: '#807000',
    icon: undefined,
    label: 'Dispatched'
  }
}

const OrderDetails = () => {
  // State
  const [uiState, setUiState] = useState<UIState>({
    isProceedDisabled: true,
    isLoading: true,
    isLoadingForTrackAndSupport: false,
    isMenuModalOpen: false,
    isCancelMenuModalOpen: false,
    isLoadingForCancel: false
  })

  const [data, setData] = useState<DataState>({
    confirmData: null,
    statusData: [],
    trackUrl: null,
    supportData: null
  })

  const [processState, setProcessState] = useState<ProcessState>({
    apiCalled: false,
    allOrderDelivered: false,
    radioValue: '',
    orderCancelled: false
  })

  const [orderStatusMap, setOrderStatusMap] = useState<OrderStatus[]>([])
  const [isError, setIsError] = useState(false)

  // Hooks
  const theme = useTheme()
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isDesktop } = useResponsive()
  const orderMetaData = useSelector((state: OrdersRootState) => state.orders.selectedOrderDetails)
  const dispatch = useDispatch()

  // Effects
  useEffect(() => {
    const storedOrderStatusMap = JSON.parse(localStorage.getItem('orderStatusMap') || '[]')
    setOrderStatusMap(storedOrderStatusMap)
  }, [])

  useEffect(() => {
    if (orderStatusMap.length > 0) {
      localStorage.setItem('orderStatusMap', JSON.stringify(orderStatusMap))
    }
  }, [orderStatusMap])

  useEffect(() => {
    if (data.statusData.length > 0) {
      const newData = data.statusData
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
        // Find if this status already exists in orderStatusMap
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
  }, [data.statusData])

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setData(prevState => ({
        ...prevState,
        confirmData: parsedConfirmData
      }))
    }
  }, [])

  // Fetch data
  useEffect(() => {
    localStorage.removeItem('statusResponse')
    const fetchData = async () => {
      try {
        setUiState(prevState => ({ ...prevState, isLoading: true }))

        let statusPayload
        if (localStorage.getItem('selectedOrder')) {
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
        } else if (data.confirmData?.length) {
          statusPayload = getPayloadForOrderStatus(data.confirmData)
        } else {
          return
        }

        const response = await axios.post(`${apiUrl}/status`, statusPayload)

        if (
          JSON.stringify(response.data) === '{}' ||
          response.data?.data?.length === 0 ||
          !response.data?.data?.[0]?.message
        ) {
          setIsError(true)
          return
        }

        const resData = response.data.data
        setData(prevState => ({
          ...prevState,
          statusData: resData
        }))
        localStorage.setItem('statusResponse', JSON.stringify(resData))
      } catch (error) {
        console.error('Error fetching order status:', error)
      } finally {
        setUiState(prevState => ({ ...prevState, isLoading: false }))
        setProcessState(prevState => ({ ...prevState, apiCalled: true }))
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 30000)
    return () => clearInterval(intervalId)
  }, [apiUrl, data.confirmData])

  // Status checks
  const isDelivered =
    data.statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === statusMap.COMPLETE
  const isCancelled = data.statusData?.[0]?.message?.order?.status === CANCELLED

  useEffect(() => {
    if (isDelivered) {
      setProcessState(prevState => ({ ...prevState, allOrderDelivered: true }))
    }
  }, [isDelivered])

  useEffect(() => {
    if (isCancelled) {
      setProcessState(prevState => ({ ...prevState, orderCancelled: true }))
    }
  }, [isCancelled])

  // Handlers
  const handleMenuModalClose = () => {
    setUiState(prevState => ({ ...prevState, isMenuModalOpen: false }))
  }

  const handleCancelMenuModalClose = () => {
    setUiState(prevState => ({ ...prevState, isCancelMenuModalOpen: false }))
  }

  const handleCancelMenuModalOpen = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: true,
      isMenuModalOpen: false
    }))
  }

  const handleEmailCustomer = (email: string) => {
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')
    setUiState(prevState => ({ ...prevState, isMenuModalOpen: false }))
  }

  const handleCallCustomer = (phoneNumber: string) => {
    const telLink = `tel:${phoneNumber}`
    window.open(telLink, '_blank')
    setUiState(prevState => ({ ...prevState, isMenuModalOpen: false }))
  }

  const handleOrderDotsClick = async () => {
    setUiState(prevState => ({ ...prevState, isLoadingForTrackAndSupport: true }))

    try {
      setUiState(prevState => ({ ...prevState, isMenuModalOpen: true }))

      let trackPayload, supportPayload
      if (data.confirmData?.length) {
        const { domain, bpp_id, bpp_uri } = data.confirmData[0].context
        const orderId = data.confirmData[0].message.orderId

        trackPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id,
                bpp_uri,
                transaction_id: uuidv4()
              },
              orderId
            }
          ]
        }

        supportPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id,
                bpp_uri,
                transaction_id: uuidv4()
              },
              message: {
                order_id: orderId,
                support: {
                  callback_phone: '+91-8858150053',
                  ref_id: '894789-43954',
                  phone: '+91 9988776543',
                  email: 'supportperson@gmail.com'
                }
              }
            }
          ]
        }
      } else if (localStorage.getItem('selectedOrder') && localStorage.getItem('statusResponse')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusResponseData = JSON.parse(localStorage.getItem('statusResponse') as string)
        const { domain } = statusResponseData[0].context

        trackPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id: bppId,
                bpp_uri: bppUri,
                transaction_id: uuidv4()
              },
              orderId
            }
          ]
        }

        supportPayload = {
          data: [
            {
              context: {
                domain,
                bpp_id: bppId,
                bpp_uri: bppUri,
                transaction_id: uuidv4()
              },
              message: {
                order_id: orderId,
                support: {
                  callback_phone: '+91-8858150053',
                  ref_id: '894789-43954',
                  phone: '+91 9988776543',
                  email: 'supportperson@gmail.com'
                }
              }
            }
          ]
        }
      }

      if (trackPayload && supportPayload) {
        const [trackResponse, supportResponse] = await Promise.all([
          axios.post(`${apiUrl}/track`, trackPayload),
          axios.post(`${apiUrl}/support`, supportPayload)
        ])

        if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message?.tracking?.url,
            supportData: {
              email: supportResponse.data.data[0].message?.support?.email,
              phone: supportResponse.data.data[0].message?.support?.phone
            }
          }))
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUiState(prevState => ({ ...prevState, isLoadingForTrackAndSupport: false }))
    }
  }

  const handleCancelButton = async (
    confirmData: ConfirmResponseModel[] | null | undefined,
    statusData: StatusResponseModel[],
    cancellationReason: string
  ) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoadingForCancel: true }))

      let cancelPayload
      if (confirmData?.length) {
        const { bpp_id, bpp_uri, domain } = confirmData[0].context
        const orderId = confirmData[0].message.orderId

        cancelPayload = {
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
                cancellation_reason_id: '4',
                descriptor: {
                  short_desc: cancellationReason
                }
              }
            }
          ]
        }
      } else if (statusData?.length && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { orderId } = selectedOrderData
        const { bpp_id, bpp_uri, domain } = statusData[0].context

        cancelPayload = {
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
                cancellation_reason_id: '4',
                descriptor: {
                  short_desc: cancellationReason
                }
              }
            }
          ]
        }
      }

      if (cancelPayload) {
        const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)
        if (cancelResponse.data.data.length > 0) {
          router.push('/orderCancellation')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUiState(prevState => ({ ...prevState, isLoadingForCancel: false }))
    }
  }

  // Menu items
  const menuItems: MenuItem[] = [
    {
      image: '/images/trackOrder.svg',
      text: 'Track Order',
      onClick: () => {
        if (data.trackUrl) window.open(data.trackUrl, '_blank')
        else
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Warning', display: true, type: 'warning', description: t.unabletoTrack }
            })
          )
      }
    },
    {
      image: '/images/updateOrder.svg',
      text: 'Edit Order',
      onClick: () => {
        Router.push('/updateShippingDetails')
      }
    },
    {
      image: '/images/cancelOrder.svg',
      text: (
        <Text
          as="span"
          color="#E93324"
          fontWeight="400"
          fontSize="15px"
        >
          Cancel Order
        </Text>
      ),
      onClick: handleCancelMenuModalOpen
    }
  ]

  const callMenuItem: MenuItem[] = [
    {
      image: '/images/callCustomer.svg',
      text: 'Call for urgent assistance',
      onClick: () => handleCallCustomer(data.supportData?.phone || '')
    },
    {
      image: '/images/emailCustomer.svg',
      text: 'Email for enquiries',
      onClick: () => handleEmailCustomer(data.supportData?.email || '')
    }
  ]

  // Loading states
  if (uiState.isLoading && !processState.apiCalled) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.statusLoaderSubText}
        />
      </Box>
    )
  }

  if (isError) {
    dispatch(
      feedbackActions.setToastData({
        toastData: {
          message: 'Error',
          display: true,
          type: 'error',
          description: t.errorText
        }
      })
    )
    return <></>
  }

  if (!data.confirmData?.length && !localStorage.getItem('selectedOrder')) {
    return <></>
  }

  if (!data.statusData?.[0]?.message) {
    localStorage.removeItem('statusResponse')
    return <></>
  }

  // Data preparation
  const { created_at } = data.statusData[0].message.order
  const { order } = data.statusData[0].message
  const { billing, fulfillments } = order
  const { address, name, phone } = billing
  const {
    customer: {
      contact: { phone: shippingPhone },
      person: { name: shippingName }
    },
    stops
  } = fulfillments[0]

  const {
    location: { address: shipmentAddress },
    contact: { phone: updateShippingPhone, name: updatedShippingName }
  } = stops[0]

  const getItems = (data: DataState): ItemDetailProps[] => {
    return data.statusData[0].message.order.items.map((item: Item) => ({
      title: item.name,
      quantity: (item.quantity as QuantityDetails)?.selected?.count,
      price: Number(getItemWiseBreakUp(data.statusData, item.id).totalPricewithCurrent.value),
      currency: getItemWiseBreakUp(data.statusData, item.id).totalPricewithCurrent.currency,
      image: item.images?.[0].url,
      breakUp: getItemWiseBreakUp(data.statusData, item.id).paymentBreakdownMap
    }))
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
    >
      <Box
        maxW={{ base: '100%', md: '50%' }}
        margin="0 auto"
        data-test={testIds.order_feedback_container}
      >
        {processState.allOrderDelivered && (
          <Card
            mt="20px"
            border={`1px solid ${theme.colors.primary[100]}`}
            className="border_radius_all"
            boxShadow={'0px 8px 10px -6px rgb(0 0 0 / 10%), 0px 20px 25px -5px rgb(0 0 0 / 10%)'}
          >
            <CardBody padding="15px 20px">
              <Flex
                alignItems="center"
                pb="3px"
              >
                <Image
                  width="20px"
                  height="20px"
                  src="/images/TrackIcon.svg"
                />
                <Text
                  as={Typography}
                  text={t.allRequestFullfilled}
                  pl="8px"
                  fontSize="17px"
                  fontWeight="600"
                />
              </Flex>
              <Flex
                alignItems="center"
                fontSize="15px"
                pl="20px"
              >
                <Text
                  pl="8px"
                  as={Typography}
                  text={t.howTodo}
                />
                <Text
                  onClick={() => {
                    dispatch(statusActions.addStatusResponse({ statusResponse: data.statusData }))
                    router.push('/feedback')
                  }}
                  pl="10px"
                  color="#0560FA"
                  as={Typography}
                  text={t.rateUs}
                  dataTest={testIds.orderDetails_rateUs_mainContainer}
                />
              </Flex>
            </CardBody>
          </Card>
        )}
      </Box>

      <Box
        display={{ base: 'block', lg: 'flex' }}
        justifyContent="space-between"
        gap="3rem"
      >
        <Box width={{ base: '100%', lg: '80%' }}>
          <DetailCard>
            <Flex
              flexDir={'column'}
              justifyContent={'space-between'}
              gap="5px"
            >
              <Flex
                flexDir={'row'}
                justifyContent={'space-between'}
              >
                <Typography
                  variant="subTitleRegular"
                  dataTest={testIds.orderDetailspage_orderOverview}
                  text={t.orderOverview}
                  fontSize="17px"
                  fontWeight="600"
                />
                <Flex
                  gap="4px"
                  className="mytrade-status"
                >
                  <Flex
                    alignItems="center"
                    gap="4px"
                    border={`0.5px solid ${parentStatusMap[data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus]?.borderColor || '#F0D402'}`}
                    borderRadius="4px"
                    padding="4px 8px"
                    bgColor={
                      parentStatusMap[
                        data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus
                      ]?.bgColor || '#FFF9CC'
                    }
                  >
                    {parentStatusMap[
                      data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus
                    ]?.icon && (
                      <Image
                        src={`${parentStatusMap[data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus]?.icon}`}
                        alt="status_icon"
                      />
                    )}
                    <Typography
                      color={
                        parentStatusMap[
                          data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus
                        ]?.color || '#807000'
                      }
                      text={`${parentStatusMap[data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus]?.label || 'In Progress'}`}
                      dataTest="order-status"
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                flexDir="row"
                gap="6rem"
                justifyContent="space-between"
              >
                <Typography
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                  text="Order ID"
                />
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    maxW: '10rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'end'
                  }}
                  text={orderMetaData.orderIds[0]}
                />
              </Flex>
              <Flex
                flexDir="row"
                gap="6rem"
                justifyContent="space-between"
              >
                <Typography
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                  text="Placed at"
                />
                <Typography
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                  text={formatTimestamp(created_at)}
                />
              </Flex>
            </Flex>
          </DetailCard>

          <DetailCard>
            <Flex
              flexDir={'column'}
              justifyContent={'space-between'}
              gap="10px"
            >
              <Typography
                variant="subTitleRegular"
                text={t.itemDetails}
                fontSize="17px"
                fontWeight="600"
              />
              <Box>
                {(getItems(data) as ItemDetailProps[])?.map((item, i, arr) => (
                  <>
                    <DetailsCard key={i}>
                      <div key={i}>
                        <ItemDetails
                          title={item.title}
                          description={item.description}
                          quantity={item.quantity}
                          price={item.price}
                          currency={item.currency}
                          image={item.image}
                          breakUp={item.breakUp}
                        />
                      </div>
                    </DetailsCard>
                    {arr.length > 1 && i !== arr.length - 1 && (
                      <Divider
                        color={'#BFBFBF'}
                        margin={'15px -20px'}
                        border="0.5px solid #BFBFBF"
                        opacity={0.5}
                      />
                    )}
                  </>
                ))}
              </Box>
            </Flex>
          </DetailCard>

          <DetailCard>
            <CardBody p={'unset'}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  text={t.fullfillmentDetails}
                  dataTest={testIds.orderDetailspage_orderId}
                  fontSize="17px"
                  fontWeight="600"
                />
                <Image
                  onClick={handleOrderDotsClick}
                  src="/images/threeDots.svg"
                  data-test={testIds.orderDetailspage_otherOptions}
                  alt="threeDots"
                  cursor={'pointer'}
                />
              </Flex>

              <Divider
                width={'unset'}
                border="0.5px solid #BFBFBF"
                opacity={0.5}
                margin={'15px -20px'}
              />

              <ViewMoreOrderModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                items={data.statusData[0].message.order.items}
                orderId={`${orderMetaData.orderIds[0].slice(0, 5)}...`}
                dataTest={testIds.orderDetailspage_viewMoreOrders}
              />

              <Box
                className="order_status_progress"
                data-test={testIds.orderDetailspage_orderStatusMap}
              >
                {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => (
                  <OrderStatusProgress
                    key={index}
                    label={status.label}
                    statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                    noLine={status.lastElement || isCancelled}
                    lastElement={status.lastElement}
                  />
                ))}
              </Box>
            </CardBody>
          </DetailCard>
        </Box>

        <Box
          display="flex"
          flexDir={{ base: 'column', lg: 'column' }}
        >
          {isDesktop ? (
            <>
              <DetailCard>
                <Typography
                  text={`${t.shipping} & ${t.billing}`}
                  fontSize="17px"
                  fontWeight="600"
                />
                <ShippingBlock
                  title={t.shipping}
                  name={{ text: updatedShippingName || shippingName, icon: nameIcon }}
                  address={{ text: shipmentAddress, icon: locationIcon }}
                  mobile={{ text: updateShippingPhone || shippingPhone, icon: CallphoneIcon }}
                  dataTest={testIds.orderDetailspage_shippingDetails}
                />
                <ShippingBlock
                  title={t.billing}
                  name={{ text: name, icon: nameIcon }}
                  address={{ text: address, icon: locationIcon }}
                  mobile={{ text: phone, icon: CallphoneIcon }}
                  dataTest={testIds.orderDetailspage_billingDetails}
                />
              </DetailCard>
              <Box>
                <PaymentDetails
                  title="Payment"
                  hasBoxShadow={true}
                  paymentBreakDown={createPaymentBreakdownMap(data.statusData)}
                  totalText="Total"
                  totalValueWithCurrency={getTotalPriceWithCurrency(data.statusData)}
                  dataTest={testIds.orderDetailspage_paymentDetails}
                />
              </Box>
            </>
          ) : (
            <>
              <Accordion
                accordionHeader={
                  <Typography
                    text={`${t.shipping} & ${t.billing}`}
                    fontSize="17px"
                    fontWeight="600"
                  />
                }
              >
                <ShippingBlock
                  title={t.shipping}
                  name={{ text: updatedShippingName || shippingName, icon: nameIcon }}
                  address={{ text: shipmentAddress, icon: locationIcon }}
                  mobile={{ text: updateShippingPhone || shippingPhone, icon: CallphoneIcon }}
                  dataTest={testIds.orderDetailspage_shippingDetails}
                />
                <ShippingBlock
                  title={t.billing}
                  name={{ text: name, icon: nameIcon }}
                  address={{ text: address, icon: locationIcon }}
                  mobile={{ text: phone, icon: CallphoneIcon }}
                  dataTest={testIds.orderDetailspage_billingDetails}
                />
              </Accordion>
              {/* <Accordion accordionHeader={t.billing}>
                <ShippingBlock
                  name={{ text: name, icon: nameIcon }}
                  address={{ text: address, icon: locationIcon }}
                  mobile={{ text: phone, icon: CallphoneIcon }}
                  dataTest={testIds.orderDetailspage_billingDetails}
                />
              </Accordion> */}
              <Accordion
                accordionHeader={
                  <Flex gap="10px">
                    <Typography
                      text={t.payment}
                      fontSize="17px"
                      fontWeight="600"
                    />
                    <Flex gap="4px">
                      <Flex
                        alignItems="center"
                        gap="2px"
                        border={`0.5px solid #C0F7E2`}
                        borderRadius="4px"
                        padding="4px 8px"
                        bgColor={'#D2F9EA'}
                      >
                        <Image
                          src={successIcon}
                          alt="status_icon"
                          width="12px"
                          height="12px"
                        />
                        <Typography
                          color={'#11704C'}
                          text={`Paid`}
                          fontSize="10px"
                          fontWeight="400"
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                }
              >
                <Box
                  pl={'14px'}
                  pr={'11px'}
                  pb={'11px'}
                  pt={'6px'}
                >
                  <PaymentDetails
                    paymentBreakDown={createPaymentBreakdownMap(data.statusData)}
                    totalText="Total"
                    totalValueWithCurrency={getTotalPriceWithCurrency(data.statusData)}
                    dataTest={testIds.orderDetailspage_paymentDetails}
                  />
                </Box>
              </Accordion>
            </>
          )}

          <BottomModal
            title=""
            isOpen={uiState.isMenuModalOpen}
            dataTest={testIds.orderDetailspage_menus}
            onClose={handleMenuModalClose}
          >
            {uiState.isLoadingForTrackAndSupport ? (
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
                height={'300px'}
              >
                <LoaderWithMessage
                  loadingText={t.pleaseWait}
                  loadingSubText={t.fetchingTrackLoaderSubtext}
                />
              </Box>
            ) : (
              <Stack
                gap="20px"
                p={'20px 0px'}
              >
                {!(['COMPLETE', 'USER CANCELLED'] as ParentStatus[]).includes(
                  data.statusData[0].message.order.fulfillments[0].state.descriptor.code as ParentStatus
                ) &&
                  menuItems.map((menuItem, index) => (
                    <>
                      <Flex
                        key={index}
                        columnGap="10px"
                        alignItems="center"
                        onClick={menuItem.onClick}
                        cursor={'pointer'}
                        data-test={testIds.orderDetailspage_menuItem}
                      >
                        <Image src={menuItem.image} />
                        <Text
                          as={Typography}
                          text={menuItem.text as string}
                          fontSize="15px"
                          dataTest={testIds.orderDetailspage_menuItemName}
                          fontWeight={400}
                        />
                      </Flex>
                      <Divider />
                    </>
                  ))}
                {callMenuItem.map((menuItem, index) => (
                  <Flex
                    key={index}
                    columnGap="10px"
                    alignItems="center"
                    onClick={menuItem.onClick}
                    cursor={'pointer'}
                    data-test={testIds.orderDetailspage_callServiceItem}
                  >
                    <Image src={menuItem.image} />
                    <Text
                      as={Typography}
                      text={menuItem.text}
                      dataTest={testIds.orderDetailspage_callServiceItemName}
                      fontSize="15px"
                      fontWeight={400}
                    />
                  </Flex>
                ))}
              </Stack>
            )}
          </BottomModal>

          <BottomModalScan
            isOpen={uiState.isCancelMenuModalOpen}
            onClose={handleCancelMenuModalClose}
            modalHeader={t.orderCancellation}
            dataTest={testIds.orderDetailspage_cancelOrder}
          >
            {uiState.isLoadingForCancel ? (
              <LoaderWithMessage
                loadingText={t.pleaseWait}
                loadingSubText={t.cancelLoaderSubText}
              />
            ) : (
              <>
                <Text
                  as={Typography}
                  text={t.pleaseSelectReason}
                  fontSize="15px"
                  fontWeight={500}
                  textAlign="center"
                  pb="20px"
                />
                <RadioGroup
                  onChange={value => {
                    setProcessState(prevValue => ({
                      ...prevValue,
                      radioValue: value
                    }))
                    setUiState(prevValue => ({
                      ...prevValue,
                      isProceedDisabled: false
                    }))
                  }}
                  value={processState.radioValue}
                  pl="20px"
                >
                  {ORDER_CANCEL_REASONS.map(reasonObj => (
                    <Stack
                      pb="10px"
                      direction="column"
                      key={reasonObj.id}
                    >
                      <Radio value={reasonObj.reason}>{reasonObj.reason}</Radio>
                    </Stack>
                  ))}
                </RadioGroup>
                <Textarea
                  w="332px"
                  m="20px"
                  height="124px"
                  resize="none"
                  fontSize={'12px'}
                  placeholder="If you chose 'Other', please specify the reason"
                  boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)"
                />
                <Box m="20px">
                  <BecknButton
                    disabled={uiState.isProceedDisabled}
                    className="checkout_btn"
                    handleClick={() => {
                      dispatch(statusActions.addStatusResponse({ statusResponse: data.statusData }))
                      handleCancelButton(
                        data.confirmData as ConfirmResponseModel[],
                        data.statusData as StatusResponseModel[],
                        processState.radioValue
                      )
                    }}
                  >
                    Confirm Cancellation
                  </BecknButton>
                </Box>
              </>
            )}
          </BottomModalScan>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderDetails
