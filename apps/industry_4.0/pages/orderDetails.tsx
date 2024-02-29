import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import { Box, Card, CardBody, Divider, Flex, Image, Radio, RadioGroup, Stack, Text, Textarea } from '@chakra-ui/react'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import { DetailCard, OrderStatusProgress, OrderStatusProgressProps } from '@beckn-ui/becknified-components'
import { StatusResponseModel, SupportModel } from '../types/status.types'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPayloadForOrderStatus } from '@utils/confirm-utils'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import { ConfirmResponseModel } from '../types/confirm.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { UIState, DataState, ProcessState } from '../types/order-details.types'

const OrderDetails = () => {
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
    radioValue: ''
  })
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [orderStatusMap, setOrderStatusMap] = useState<any[]>([])
  const [currentStatusLabel, setCurrentStatusLabel] = useState('')

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
        .map((status: any) => ({
          label: status?.message?.order?.fulfillments[0]?.state?.descriptor?.short_desc,
          statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at
        }))
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

  // Define functions to handle menu modal opening and closing
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

  // Fetch data on component
  useEffect(() => {
    const fetchData = () => {
      if (localStorage && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: '',
                bpp_id: bppId,
                bpp_uri: bppUri,
                domain: 'supply-chain-services:assembly'
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

    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [apiUrl, data.confirmData])

  // Check if the order is delivered
  const isDelivered = data.statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === 'DELIVERED'

  useEffect(() => {
    if (isDelivered) {
      setProcessState(prevState => ({
        ...prevState,
        allOrderDelivered: true
      }))
    }
  }, [isDelivered])

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
                domain,
                bpp_id,
                bpp_uri,
                transaction_id
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

        if (trackResponse.data && supportResponse.data) {
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message.tracking.url,
            supportData: {
              email: supportResponse.data.data[0].message.support.email,
              phone: supportResponse.data.data[0].message.support.phone
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

        if (trackResponse.data && supportResponse.data) {
          setData(prevState => ({
            ...prevState,
            trackUrl: trackResponse.data.data[0].message.tracking.url,
            supportData: {
              email: supportResponse.data.data[0].message.support.email,
              phone: supportResponse.data.data[0].message.support.phone
            }
          }))

          setUiState(prevState => ({
            ...prevState,
            isLoadingForTrackAndSupport: false
          }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Display loading state if data is still being fetched
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

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY="scroll"
    >
      {processState.allOrderDelivered && (
        <Card
          mt="20px"
          border="1px solid rgba(94, 196, 1, 1)"
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
                onClick={() => router.push('/feedback')}
                pl="10px"
                color="#0560FA"
                as={Typography}
                text={t.rateUs}
              />
            </Flex>
          </CardBody>
        </Card>
      )}

      {/* Display progress summary */}
      <Box
        pb="15px"
        pt="20px"
      >
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
                text={t.assembly}
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
              justifyContent="space-between"
              alignItems="center"
              pt="10px"
            >
              <Typography
                variant="subTitleRegular"
                text="RTAL Assembly Line"
                fontSize="12px"
              />
              <Typography
                variant="subTitleRegular"
                text={
                  data.statusData[0]?.message?.order?.fulfillments[0]?.state?.descriptor?.code === 'DELIVERED'
                    ? t.completed
                    : ''
                }
                fontSize="15px"
                className={
                  data.statusData[0]?.message?.order?.fulfillments[0]?.state?.descriptor?.code === 'DELIVERED'
                    ? 'order_status_text_completed'
                    : ''
                }
              />
            </Flex>
          </>
          <Divider
            mr={'-20px'}
            ml="-20px"
            width={'unset'}
            pt="15px"
          />

          {/* Display order status progress */}
          <Box className="order_status_progress">
            {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => (
              <OrderStatusProgress
                key={index}
                label={status.label}
                statusTime={formatTimestamp(status.statusTime)}
              />
            ))}
          </Box>
        </CardBody>
      </DetailCard>

      {/* Display main bottom modal */}
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
  )
}

export default OrderDetails
