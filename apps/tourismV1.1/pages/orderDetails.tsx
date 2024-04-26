import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Box, Card, CardBody, Divider, Flex, Image, Text, useDisclosure, useTheme } from '@chakra-ui/react'
import { Accordion, Typography } from '@beckn-ui/molecules'
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

  // const isFlowCityOfParis = useSelector(
  //   (state: { orderObjectUrl: { orderObjectUrl: string; isFlowCityOfParis: boolean } }) =>
  //     state.orderObjectUrl.isFlowCityOfParis
  // )

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      setData(prevState => ({
        ...prevState,
        confirmData: parsedConfirmData
      }))
    }
  }, [])

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
  }, [apiUrl, data.confirmData])

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
                  color="#0560FA"
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
          <Box marginBottom={'8px'}>
            <Typography
              variant="subTitleRegular"
              text={t.orderOverview}
              fontSize="17px"
            />
          </Box>

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

          <Box>
            <Accordion accordionHeader={t.openinWallet}>
              <CardBody pt="unset">
                <Qrcode value={'https://tourism-app.becknprotocol.io/'} />
              </CardBody>
            </Accordion>
            <Accordion accordionHeader={t.viewJSON}>
              <CardBody pt="unset">
                <Qrcode value={'https://tourism-app.becknprotocol.io/'} />
              </CardBody>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderDetails
