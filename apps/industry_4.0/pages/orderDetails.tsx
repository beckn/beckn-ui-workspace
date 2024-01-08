import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Box, Card, CardBody, Divider, Flex, Image, Radio, RadioGroup, Stack, Text, Textarea } from '@chakra-ui/react'
import { BottomModal, Loader, Typography } from '@beckn-ui/molecules'
import { DetailCard, OrderStatusProgress } from '@beckn-ui/becknified-components'
import { StatusResponseModel } from '../types/status.types'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPayloadForOrderStatus } from '@utils/confirm-utils'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import { ConfirmResponseModel } from '../types/confirm.types'

// Define the main functional component
const OrderDetails = () => {
  // Define state variables
  const [isProceedDisabled, setIsProceedDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [statusData, setStatusData] = useState<StatusResponseModel[]>([])
  const [apiCalled, setApiCalled] = useState(false)
  const [allOrderDelivered, setAllOrderDelivered] = useState(false)
  const [isMenuModalOpen, setMenuModalOpen] = useState(false)
  const [isCancelMenuModalOpen, setCancelMenuModalOpen] = useState(false)
  const [radioValue, setRadioValue] = useState('')
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Define a mapping for order status
  const orderStatusMap = {
    IN_ASSEMBLY_LINE: 'In Assembly Line',
    ITEM_DISPATCHED: 'Item Dispatched',
    DELIVERED: 'Delivered'
  }

  // Define cancellation reasons
  const orderCancelReason = [
    { id: 1, reason: 'Merchant is taking too long' },
    { id: 2, reason: 'Ordered by mistake' },
    { id: 3, reason: 'I’ve changed my mind' },
    { id: 4, reason: 'Other' }
  ]

  // Define functions to handle menu modal opening and closing
  const handleMenuModalClose = () => {
    setMenuModalOpen(false)
  }

  const handleCancelMenuModalClose = () => {
    setCancelMenuModalOpen(false)
  }

  const handleCancelMenuModalOpen = () => {
    setCancelMenuModalOpen(true)
    setMenuModalOpen(false)
  }

  const handleEmailCustomer = () => {
    const emailAddress = 'customer@example.com'
    const subject = 'Regarding Your Order'
    const body = 'Dear Customer,\n\n'

    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.open(mailtoLink, '_blank')
    setMenuModalOpen(false)
  }
  const handleCallCustomer = () => {
    const phoneNumber = '+1234567890' // Replace with the actual phone number

    // Use tel: protocol to initiate the phone call
    const telLink = `tel:${phoneNumber}`

    // Open the phone app to initiate the call
    window.open(telLink, '_blank')
    setMenuModalOpen(false)
  }

  // Define menu items for the main menu
  const menuItems = [
    { image: '/images/trackOrder.svg', text: 'Track Order', onClick: () => {} },
    { image: '/images/updateOrder.svg', text: 'Update Order', onClick: () => {} },
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
  const callMenuItem = [
    { image: '/images/callCustomer.svg', text: 'Call Customer Service', onClick: handleCallCustomer },
    { image: '/images/emailCustomer.svg', text: 'Email Customer Service', onClick: handleEmailCustomer }
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
        setIsLoading(true)

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            const resData = res.data.data
            setStatusData(resData)
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
            setApiCalled(true)
          })
      }
      if (localStorage && localStorage.getItem('confirmResponse')) {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        const statusPayload = getPayloadForOrderStatus(parsedConfirmData)
        setIsLoading(true)

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            const resData = res.data.data
            setStatusData(resData)
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
            setApiCalled(true)
          })
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [apiUrl])

  // Check if the order is delivered
  const isDelivered = statusData?.[0]?.message?.order?.fulfillments?.[0]?.state?.descriptor?.code === 'DELIVERED'

  useEffect(() => {
    if (isDelivered) {
      setAllOrderDelivered(true)
    }
  }, [isDelivered])

  // Display loading state if data is still being fetched
  if (isLoading && !apiCalled) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <Loader>
          <Box
            mt="13px"
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <Text
              as={Typography}
              fontWeight={600}
              fontSize="15px"
              text={t.pleaseWait}
            />

            <Text
              as={Typography}
              text={t.statusLoaderSubText}
              textAlign="center"
              alignSelf="center"
              fontWeight={400}
              fontSize="15px"
            />
          </Box>
        </Loader>
      </Box>
    )
  }

  // Return the main JSX structure
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY="scroll"
    >
      {/* Display completion message if all orders are delivered */}
      {allOrderDelivered && (
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
        <CardBody>
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
                onClick={() => setMenuModalOpen(true)}
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
                  statusData[0]?.message?.order?.fulfillments[0]?.state?.descriptor?.code === 'DELIVERED'
                    ? t.completed
                    : ''
                }
                fontSize="15px"
                className={
                  statusData[0]?.message?.order?.fulfillments[0]?.state?.descriptor?.code === 'DELIVERED'
                    ? 'order_status_text_completed'
                    : ''
                }
              />
            </Flex>
          </>
          <Divider />

          {/* Display order status progress */}
          <Box className="order_status_progress">
            <OrderStatusProgress
              orderStatusMap={orderStatusMap}
              orderState={statusData[0]?.message?.order?.fulfillments[0]?.state?.descriptor?.code}
              statusTime={formatTimestamp(statusData[0]?.message?.order?.fulfillments[0]?.state?.updated_at)}
            />
          </Box>
        </CardBody>
      </DetailCard>

      {/* Display main bottom modal */}
      <BottomModal
        isOpen={isMenuModalOpen}
        onClose={handleMenuModalClose}
      >
        <Stack
          gap="20px"
          p={'20px 0px'}
        >
          {menuItems.map((menuItem, index) => (
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
          {callMenuItem.map((menuItem, index) => (
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
      </BottomModal>

      {/* Display cancellation bottom modal */}
      <BottomModalScan
        isOpen={isCancelMenuModalOpen}
        onClose={handleCancelMenuModalClose}
        modalHeader={t.orderCancellation}
      >
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
            setRadioValue(value)
            setIsProceedDisabled(false)
          }}
          value={radioValue}
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
            disabled={isProceedDisabled}
            children="Proceed"
            className="checkout_btn"
            handleClick={() => router.push('/orderCancellation')}
          />
        </Box>
      </BottomModalScan>
    </Box>
  )
}

export default OrderDetails
