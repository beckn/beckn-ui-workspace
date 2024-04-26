import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
import { Accordion, Typography, BottomModal } from '@beckn-ui/molecules'
import { useDispatch, useSelector } from 'react-redux'
import ViewMoreOrderModal from '@components/orderDetailComponents/ViewMoreOrder'
import { statusActions } from '@store/status-slice'
import { DetailCard, OrderStatusProgress, OrderStatusProgressProps } from '@beckn-ui/becknified-components'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPayloadForOrderStatus } from '@utils/confirm-utils'

import { ConfirmResponseModel } from '../types/confirm.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { UIState, DataState, ProcessState } from '../types/order-details.types'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
import { OrdersRootState } from '@store/order-slice'
import ShippingBlock from '@components/orderDetailComponents/Shipping'
import { DOMAIN } from '@lib/config'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import { getPaymentBreakDown } from '@utils/checkout-utils'
import Qrcode from '@components/qrCode/Qrcode'
import { StatusResponseModel, SupportModel } from '../types/status.types'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import { isEmpty } from '@utils/common-utils'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const statusMap = {
  ArrangingPayment: 'Processing your order',
  PaymentSettled: 'Ready to ship',
  Cancelled: 'Order Cancelled!',
  Shipped: 'Order Shipped',
  Delivered: 'Order Delivered'
}

const DELIVERED = 'Delivered'
const CANCELLED = 'CANCELLED'

const OrderDetails = () => {
  const [uiState, setUiState] = useState<UIState>({
    isProceedDisabled: true,
    isLoading: true,
    isLoadingForTrackAndSupport: false,
    isMenuModalOpen: false,
    isCancelMenuModalOpen: false,
    isLoadingForCancel: false
  })

  const theme = useTheme()

  const [data, setData] = useState<DataState>({
    confirmData: null,
    statusData: [],
    trackUrl: null,
    supportData: null
  })

  const [processState, setProcessState] = useState<ProcessState>({
    apiCalled: false,
    allOrderDelivered: false,
    radioValue: ''
  })
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [orderStatusMap, setOrderStatusMap] = useState<any[]>([])
  const { isDesktop } = useResponsive()
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)
  const orderMetaData = useSelector((state: OrdersRootState) => state.orders.selectedOrderDetails)
  const dispatch = useDispatch()
  const [currentStatusLabel, setCurrentStatusLabel] = useState('')
  const [isError, setIsError] = useState(false)
  const [trigger, setTrigger] = useState(0)

  const orderObjectUrl = useSelector(
    (state: { orderObjectUrl: { orderObjectUrl: string; isFlowCityOfParis: boolean } }) =>
      state.orderObjectUrl.orderObjectUrl
  )
  const retailAppUrl = process.env.NEXT_PUBLIC_RETAIL_APP_URL
  const selectionPageUrl = process.env.NEXT_PUBLIC_SELECTION_PAGE_URL

  const isFlowCityOfParis = false // we will remove this after getting tags in status

  useEffect(() => {
    const storedOrderStatusMap = JSON.parse(localStorage.getItem('orderStatusMap') || '[]')
    setOrderStatusMap(storedOrderStatusMap)
  }, [])

  useEffect(() => {
    if (orderStatusMap.length > 0) {
      localStorage.setItem('orderStatusMap', JSON.stringify(orderStatusMap))
      setCurrentStatusLabel(orderStatusMap[orderStatusMap.length - 1].label)
    }
  }, [orderStatusMap])

  useEffect(() => {
    if (data.statusData.length > 0) {
      const newData = data.statusData
        .map((status: any) => {
          const { tags } = status?.message?.order
          console.log(
            'my nammeme',
            status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp
          )

          return {
            label: statusMap[tags[tags.length - 1].list[0].value],
            // statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at
            statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp
          }
        })
        .filter((status: any) => status.label)

      const labelSet = new Set(orderStatusMap.map(status => status.label))

      setOrderStatusMap(prevState => [...prevState, ...newData.filter(status => !labelSet.has(status.label))])
    }
  }, [data.statusData])

  const orderCancelReason = [
    { id: 1, reason: 'Merchant is taking too long' },
    { id: 2, reason: 'Ordered by mistake' },
    { id: 3, reason: 'I’ve changed my mind' },
    { id: 4, reason: 'Other' }
  ]

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setData(prevState => ({
        ...prevState,
        confirmData: parsedConfirmData
      }))
    }
  }, [])

  const handleMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  const handleCancelMenuModalClose = () => {
    setUiState(prevState => ({
      ...prevState,
      isCancelMenuModalOpen: false
    }))
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
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }
  const handleCallCustomer = (phoneNumber: string) => {
    // Use tel: protocol to initiate the phone call
    const telLink = `tel:${phoneNumber}`

    // Open the phone app to initiate the call
    window.open(telLink, '_blank')
    setUiState(prevState => ({
      ...prevState,
      isMenuModalOpen: false
    }))
  }

  // Define menu items for the main menu
  const menuItems = (trackingUrl: string) => [
    {
      image: '/images/trackOrder.svg',
      text: 'Track Order',
      onClick: () => {
        window.open(trackingUrl, '_blank')
      }
    },
    {
      image: '/images/updateOrder.svg',
      text: 'Update Order',
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

  // Define menu items for the call menu
  const callMenuItem = (supportInfo: SupportModel) => [
    {
      image: '/images/callCustomer.svg',
      text: 'Call Customer Service',
      onClick: () => handleCallCustomer(supportInfo.phone)
    },
    {
      image: '/images/emailCustomer.svg',
      text: 'Email Customer Service',
      onClick: () => handleEmailCustomer(supportInfo.email)
    }
  ]

  useEffect(() => {
    const fetchData = () => {
      if (localStorage && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: transactionId,
                bpp_id: bppId,
                bpp_uri: bppUri,
                domain: DOMAIN
              },
              message: {
                order_id: orderId
              }
            }
          ]
        }
        setUiState(prevState => ({
          ...prevState,
          isLoading: true
        }))
        setProcessState(prevState => ({
          ...prevState,
          apiCalled: false
        }))

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError(true)
            }
            const resData = res.data.data
            setData(prevState => ({
              ...prevState,
              statusData: resData
            }))
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setUiState(prevState => ({
              ...prevState,
              isLoading: false
            }))

            setProcessState(prevState => ({
              ...prevState,
              apiCalled: true
            }))
          })
      }
      if (data.confirmData && data.confirmData.length > 0) {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        const statusPayload = getPayloadForOrderStatus(parsedConfirmData)
        setUiState(prevState => ({
          ...prevState,
          isLoading: true
        }))
        setProcessState(prevState => ({
          ...prevState,
          apiCalled: false
        }))

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError(true)
            }
            const resData = res.data.data
            setData(prevState => ({
              ...prevState,
              statusData: resData
            }))

            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setUiState(prevState => ({
              ...prevState,
              isLoading: false
            }))
            setProcessState(prevState => ({
              ...prevState,
              apiCalled: true
            }))
          })
      }
    }

    fetchData()
  }, [apiUrl, data.confirmData, trigger])

  // Check if the order is delivered  come her
  const isDelivered = data.statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === DELIVERED
  const isCancelled = data.statusData?.[0]?.message?.order?.status === CANCELLED

  useEffect(() => {
    if (isDelivered) {
      setProcessState(prevState => ({
        ...prevState,
        allOrderDelivered: true
      }))
    }
  }, [isDelivered])

  useEffect(() => {
    if (isCancelled) {
      setProcessState(prevState => ({
        ...prevState,
        orderCancelled: true
      }))
    }
  }, [isCancelled])

  const handleOrderDotsClick = async () => {
    setUiState(prevState => ({
      ...prevState,
      isLoadingForTrackAndSupport: true
    }))

    try {
      setUiState(prevState => ({
        ...prevState,
        isMenuModalOpen: true
      }))

      if (data.confirmData && data.confirmData.length > 0) {
        const { domain, bpp_id, bpp_uri, transaction_id } = data.confirmData[0].context
        const orderId = data.confirmData[0].message.orderId
        const trackPayload = {
          data: [
            {
              context: {
                domain: domain,
                bpp_id: bpp_id,
                bpp_uri: bpp_uri,
                transaction_id: uuidv4()
              },
              orderId
              // callbackUrl: 'https://dhp-network-bap.becknprotocol.io/track/callback'
            }
          ]
        }

        const supportPayload = {
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

        const [trackResponse, supportResponse] = await Promise.all([
          axios.post(`${apiUrl}/track`, trackPayload),
          axios.post(`${apiUrl}/support`, supportPayload)
        ])

        if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message && trackResponse.data.data[0].message.tracking.url,
            supportData: {
              email: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.email,
              phone: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.phone
            }
          }))

          setUiState(prevState => ({
            ...prevState,
            isLoadingForTrackAndSupport: false
          }))
        }
      } else if (localStorage.getItem('selectedOrder') && localStorage.getItem('statusResponse')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusResponseData = JSON.parse(localStorage.getItem('statusResponse') as string)
        const { domain, transaction_id } = statusResponseData[0].context
        const trackPayload = {
          data: [
            {
              context: {
                domain: domain,
                bpp_id: bppId,
                bpp_uri: bppUri,
                transaction_id: transaction_id
              },
              orderId,
              callbackUrl: 'https://dhp-network-bap.becknprotocol.io/track/callback'
            }
          ]
        }

        const supportPayload = {
          data: [
            {
              context: {
                domain: domain,
                bpp_id: bppId,
                bpp_uri: bppUri,
                transaction_id: transaction_id
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

        const [trackResponse, supportResponse] = await Promise.all([
          axios.post(`${apiUrl}/track`, trackPayload),
          axios.post(`${apiUrl}/support`, supportPayload)
        ])

        if (!isEmpty(trackResponse.data) && !isEmpty(supportResponse.data)) {
          console.log('Dank support', supportResponse.data)
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message && trackResponse.data.data[0].message.tracking.url,
            supportData: {
              email: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.email,
              phone: supportResponse.data.data[0].message && supportResponse.data.data[0].message.support.phone
            }
          }))

          setUiState(prevState => ({
            ...prevState,
            isLoadingForTrackAndSupport: false
          }))
        }
      }
      setUiState(prevState => ({
        ...prevState,
        isLoadingForTrackAndSupport: false
      }))
    } catch (error) {
      console.error(error)
    }
  }

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

  const totalQuantityOfOrder = (data: any) => {
    let count = 0
    data.statusData[0].message.order.items.forEach((item: any) => {
      count += item.quantity.selected.count
    })
    return count
  }

  if (isError) {
    return toast.error('Something went wrong', {
      position: 'top-center'
    })
  }

  if (!data.confirmData?.length && !localStorage.getItem('selectedOrder')) {
    return <></>
  }

  const handleCancelButton = async (
    confirmData: ConfirmResponseModel[] | null | undefined,
    statusData: StatusResponseModel[],
    cancellationReason: string
  ) => {
    try {
      setUiState(prevState => ({
        ...prevState,
        isLoadingForCancel: true
      }))

      // console.log(confirmData)
      if (confirmData && confirmData.length > 0) {
        const { transaction_id, bpp_id, bpp_uri, domain } = confirmData[0].context
        const orderId = confirmData[0].message.orderId
        const cancelPayload = {
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

        const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)

        if (cancelResponse.data.data.length > 0) {
          router.push('/orderCancellation')
        }
      } else if (statusData && statusData.length > 0 && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { orderId } = selectedOrderData
        const { transaction_id, bpp_id, bpp_uri, domain } = statusData[0].context
        const cancelPayload = {
          data: [
            {
              context: {
                transaction_id,
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

        const cancelResponse = await axios.post(`${apiUrl}/cancel`, cancelPayload)
        if (cancelResponse.data.data.length > 0) {
          router.push('/orderCancellation')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUiState(prevState => ({
        ...prevState,
        isLoadingForCancel: false
      }))
    }
  }

  const { timestamp } = data.statusData[0].context
  const { order } = data.statusData[0].message
  const {
    billing,
    fulfillments,
    quote: { breakup, price }
  } = order
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
    contact: { phone: updateShippingPhone, email: updatedShippingEmail, name: updatedShippingName }
  } = stops[0]

  const statusData = data.statusData
  const totalOrdersQty = statusData.length
  const filteredOrder = statusData.filter(res => {
    res.message?.order?.fulfillments?.[0]?.state?.descriptor?.short_desc?.toLowerCase() === 'delivered'
  })

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY="scroll"
    >
      <Box
        maxW={{ base: '100%', md: '50%' }}
        margin="0 auto"
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
                  color="#53A052"
                  as={Typography}
                  text={t.rateUs}
                />
              </Flex>
            </CardBody>
          </Card>
        )}
      </Box>
      <Box
        display={{ base: 'block', lg: 'flex' }}
        justifyContent="space-between"
        marginTop="20px"
        gap="3rem"
      >
        <Box width={{ base: '100%', lg: '80%' }}>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
            marginBottom={'8px'}
          >
            <Typography
              variant="subTitleRegular"
              text={t.orderOverview}
              fontSize="17px"
            />
            <Image
              cursor={'pointer'}
              onClick={() => setTrigger(trigger + 1)}
              src={'/images/refresh.svg'}
              alt="icon-to-refresh"
            />
          </Flex>

          <DetailCard>
            <Flex
              pt={'unset'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography
                text={t.orderPlacedAt}
                variant={'subTitleRegular'}
              />
              <Typography
                text={formatTimestamp(timestamp)}
                variant={'subTitleRegular'}
              />
            </Flex>

            <Flex
              pt={4}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography
                text={t.ordersFulfilled}
                variant={'subTitleRegular'}
              />
              <Typography
                text={`${filteredOrder.length} of ${totalOrdersQty}`}
                variant={'subTitleRegular'}
              />
            </Flex>
          </DetailCard>

          {/* Display progress summary */}
          <Box marginTop={'21px'}>
            <Typography
              variant="subTitleRegular"
              text={t.progressSummary}
              fontSize="17px"
            />
          </Box>

          {/* Display order status details */}
          <DetailCard>
            <CardBody p={'unset'}>
              <>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    as={Typography}
                    // TODO
                    text={`Order Id: ${orderMetaData.orderIds[0].slice(0, 5)}...`}
                    fontSize="17px"
                    fontWeight="600"
                  />
                  <Image
                    onClick={handleOrderDotsClick}
                    src="/images/threeDots.svg"
                    alt="threeDots"
                  />
                </Flex>

                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Flex maxWidth={'57vw'}>
                    <Text
                      textOverflow={'ellipsis'}
                      overflow={'hidden'}
                      whiteSpace={'nowrap'}
                      fontSize={'12px'}
                      fontWeight={'400'}
                    >
                      {data.statusData[0]?.message?.order?.items[0]?.name}
                    </Text>
                    {totalQuantityOfOrder(data) > 1 && (
                      <Text
                        pl={'5px'}
                        color={'green'}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        onClick={onOpen}
                      >
                        +{totalQuantityOfOrder(data) - 1}
                      </Text>
                    )}
                  </Flex>

                  <Text
                    fontSize={'15px'}
                    fontWeight={'500'}
                    color={data.statusData[0].message.order.status === 'CANCELLED' ? 'red' : 'green'}
                  >
                    {data.statusData[0].message.order.status}
                  </Text>
                </Flex>
              </>
              <Divider
                mr={'-20px'}
                ml="-20px"
                width={'unset'}
                pt="15px"
              />
              <ViewMoreOrderModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                items={data.statusData[0].message.order.items}
                orderId={`${orderMetaData.orderIds[0].slice(0, 5)}...`}
              />

              {/* Display order status progress */}
              <Box className="order_status_progress">
                {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => {
                  return (
                    <OrderStatusProgress
                      key={index}
                      label={status.label}
                      statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                      noLine={isDelivered || isCancelled}
                      lastElement={orderStatusMap.length - 1 === index}
                    />
                  )
                })}
              </Box>
            </CardBody>
          </DetailCard>
        </Box>

        {/* shipping and billing address */}

        <Box
          display="flex"
          flexDir={{ base: 'column', lg: 'column' }}
          gap="1rem"
        >
          {isDesktop && (
            <ShippingBlock
              title={t.shipping}
              name={{ text: updatedShippingName || shippingName, icon: nameIcon }}
              address={{ text: shipmentAddress, icon: locationIcon }}
              mobile={{ text: updateShippingPhone || shippingPhone, icon: CallphoneIcon }}
            />
          )}
          {!isDesktop && (
            <Accordion accordionHeader={t.shipping}>
              <ShippingBlock
                // title={t.shipping}
                name={{ text: updatedShippingName || shippingName, icon: nameIcon }}
                address={{ text: shipmentAddress, icon: locationIcon }}
                mobile={{ text: updateShippingPhone || shippingPhone, icon: CallphoneIcon }}
              />
            </Accordion>
          )}

          {isDesktop && (
            <ShippingBlock
              title={t.billing}
              name={{ text: name, icon: nameIcon }}
              address={{ text: address, icon: locationIcon }}
              mobile={{ text: phone, icon: CallphoneIcon }}
            />
          )}
          {!isDesktop && (
            <Accordion accordionHeader={t.billing}>
              <ShippingBlock
                // title={t.shipping}
                name={{ text: name, icon: nameIcon }}
                address={{ text: address, icon: locationIcon }}
                mobile={{ text: phone, icon: CallphoneIcon }}
              />
            </Accordion>
          )}

          {isDesktop && (
            <Box>
              <PaymentDetails
                title="Payment"
                hasBoxShadow={true}
                paymentBreakDown={getPaymentBreakDown(data.statusData).breakUpMap}
                totalText="Total"
                totalValueWithCurrency={getPaymentBreakDown(data.statusData).totalPricewithCurrent}
              />
            </Box>
          )}

          {!isDesktop && (
            <Accordion accordionHeader={t.payment}>
              <Box
                pl={'14px'}
                pr={'11px'}
                pb={'11px'}
                pt={'6px'}
              >
                <PaymentDetails
                  paymentBreakDown={getPaymentBreakDown(data.statusData).breakUpMap}
                  totalText="Total"
                  totalValueWithCurrency={getPaymentBreakDown(data.statusData).totalPricewithCurrent}
                />
              </Box>
            </Accordion>
          )}
          {orderObjectUrl && (
            <Box>
              <Accordion accordionHeader={t.openinWallet}>
                <CardBody pt="unset">
                  <Qrcode
                    value={
                      isFlowCityOfParis
                        ? `${selectionPageUrl}??external_url=${orderObjectUrl}`
                        : `${retailAppUrl}/??&external_url=${orderObjectUrl}`
                    }
                  />
                </CardBody>
              </Accordion>
              <Accordion accordionHeader={t.viewJSON}>
                <CardBody pt="unset">
                  <Qrcode value={orderObjectUrl} />
                </CardBody>
              </Accordion>
            </Box>
          )}
        </Box>

        <BottomModal
          title=""
          isOpen={uiState.isMenuModalOpen}
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
              {menuItems(data.trackUrl as string).map((menuItem, index) => (
                <Flex
                  key={index}
                  columnGap="10px"
                  alignItems="center"
                  onClick={menuItem.onClick}
                >
                  <Image src={menuItem.image} />
                  <Text
                    as={Typography}
                    text={menuItem.text}
                    fontSize="15px"
                    fontWeight={400}
                  />
                </Flex>
              ))}
              <Divider />
              {callMenuItem(data.supportData as SupportModel).map((menuItem, index) => (
                <Flex
                  key={index}
                  columnGap="10px"
                  alignItems="center"
                  onClick={menuItem.onClick}
                >
                  <Image src={menuItem.image} />
                  <Text
                    as={Typography}
                    text={menuItem.text}
                    fontSize="15px"
                    fontWeight={400}
                  />
                </Flex>
              ))}
            </Stack>
          )}
        </BottomModal>

        {/* Display cancellation bottom modal */}
        <BottomModalScan
          isOpen={uiState.isCancelMenuModalOpen}
          onClose={handleCancelMenuModalClose}
          modalHeader={t.orderCancellation}
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
                {orderCancelReason.map(reasonObj => (
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
                placeholder="Please specify the reason"
                boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)"
              />
              <Box m="20px">
                <BecknButton
                  disabled={uiState.isProceedDisabled}
                  children="Proceed"
                  className="checkout_btn"
                  handleClick={() => {
                    handleCancelButton(
                      data.confirmData as ConfirmResponseModel[],
                      data.statusData as StatusResponseModel[],
                      processState.radioValue
                    )
                  }}
                />
              </Box>
            </>
          )}
        </BottomModalScan>
      </Box>
    </Box>
  )
}

export default OrderDetails
