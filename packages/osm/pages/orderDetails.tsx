import { Box, CardBody, Divider, Flex, Stack, Text, Image, StackDivider, Card, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Accordion } from '@beckn-ui/common'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ResponseModel } from '../lib/types/responseModel'
import {
  getConfirmMetaDataForBpp,
  getOrderPlacementTimeline,
  getPayloadForStatusRequest,
  getPayloadForTrackRequest
} from '../utilities/confirm-utils'
import { generateAlphanumericID, getDataPerBpp, storeOrderDetails } from '../utilities/orderDetails-utils'
import { getSubTotalAndDeliveryChargesForOrder } from '../utilities/orderHistory-utils'
import lineBlack from '../public/images/lineBlack.svg'
import TrackIcon from '../public/images/TrackIcon.svg'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
import { useSelector } from 'react-redux'
import { TransactionIdRootState } from '../lib/types/cart'
import useRequest from '../hooks/useRequest'
import { orderCardStatusMap, RenderOrderStatusList } from '../components/orderDetails/RenderOrderStatusTree'
import { useRouter } from 'next/router'

const OrderDetails = () => {
  const [allOrderDelivered, setAllOrderDelivered] = useState(false)
  const [confirmData, setConfirmData] = useState<ResponseModel[]>([])
  const [statusResponse, setStatusResponse] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const statusRequest = useRequest()
  const trackRequest = useRequest()
  const router = useRouter()
  const { orderId } = router.query

  const { t } = useLanguage()

  useEffect(() => {
    if (orderId && localStorage && localStorage.getItem('orderHistoryArray')) {
      const parsedOrderHistoryArray = JSON.parse(localStorage.getItem('orderHistoryArray') as string)

      const relatedOrder = parsedOrderHistoryArray.find((parsedOrder: any) => parsedOrder.parentOrderId === orderId)

      setConfirmData(relatedOrder.orders)

      const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(relatedOrder.orders)
      const payloadForStatusRequest = getPayloadForStatusRequest(confirmOrderMetaDataPerBpp, transactionId)
      const payloadForTrackRequest = getPayloadForTrackRequest(confirmOrderMetaDataPerBpp, transactionId)

      trackRequest.fetchData(`${apiUrl}/client/v2/track`, 'POST', payloadForTrackRequest)

      const intervalId = setInterval(() => {
        statusRequest.fetchData(`${apiUrl}/client/v2/status`, 'POST', payloadForStatusRequest)
      }, 2000)

      return () => {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (localStorage) {
      const stringifiedConfirmData = localStorage.getItem('confirmData')
      if (stringifiedConfirmData) {
        const parsedConfirmedData = JSON.parse(stringifiedConfirmData)
        setConfirmData(parsedConfirmedData)

        const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(parsedConfirmedData)
        const payloadForStatusRequest = getPayloadForStatusRequest(confirmOrderMetaDataPerBpp, transactionId)
        const payloadForTrackRequest = getPayloadForTrackRequest(confirmOrderMetaDataPerBpp, transactionId)

        trackRequest.fetchData(`${apiUrl}/client/v2/track`, 'POST', payloadForTrackRequest)

        const intervalId = setInterval(() => {
          statusRequest.fetchData(`${apiUrl}/client/v2/status`, 'POST', payloadForStatusRequest)
        }, 2000)

        return () => {
          clearInterval(intervalId)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (statusRequest.data) {
      setStatusResponse(statusRequest.data as any)
      if (statusRequest.data.every(res => res.message.order.state === 'DELIVERED')) {
        setAllOrderDelivered(true)
      }
    }
  }, [statusRequest.data])

  console.log('confirmData', confirmData)

  if (!confirmData.length) {
    return <></>
  }

  const confirmDataPerBpp = getDataPerBpp(confirmData)

  const orderFromConfirmData = confirmData[0].message.responses[0].message.order

  const { subTotal, totalDeliveryCharge } = getSubTotalAndDeliveryChargesForOrder(confirmData)

  const orderState = orderFromConfirmData.payment.status

  const totalQuantityOfOrder = (res: any) => {
    let count = 0
    res.message.order.items.forEach((item: any) => {
      count += item.quantity.count
    })
    return count
  }

  const getExtractedName = (str: string) => {
    const parts = str
      .trim()
      .split('/')
      .filter(part => part !== '')
    const extracted = parts[parts.length - 1]

    return extracted
  }

  const shippingDetails = {
    name: getExtractedName(orderFromConfirmData.billing.name),
    address: orderFromConfirmData.billing.address.state,
    phone: orderFromConfirmData.billing.phone
  }

  return (
    <>
      {/* <AppHeader appHeaderText={t.selectPaymentMethod} /> */}
      {allOrderDelivered ? (
        <Card mb={'20px'} border={'1px solid rgba(94, 196, 1, 1)'} className="border_radius_all">
          <CardBody padding={'15px 20px'}>
            <Flex alignItems={'center'} pb={'3px'}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image width={'12px'} height={'13px'} src={TrackIcon} />
              <Text pl={'8px'} fontSize={'17px'} fontWeight={'600'}>
                All orders delivered!
              </Text>
            </Flex>
            <Flex alignItems={'center'} fontSize={'15px'} pl={'20px'}>
              <Text>How did we do?</Text>
              <Text onClick={() => router.push('/feedback')} pl={'10px'} color={'rgba(var(--color-primary))'}>
                Rate Us
              </Text>
            </Flex>
          </CardBody>
        </Card>
      ) : null}
      <Accordion
        accordionHeader={
          <Box>
            <Text>{t.orderSummary}</Text>
          </Box>
        }
      >
        <CardBody pt={'unset'} fontSize={'15px'}>
          <Flex pt={'unset'} justifyContent={'space-between'} alignItems={'center'}>
            <Text>{t.orderPlacedAt}</Text>
            <Text>{getOrderPlacementTimeline(orderFromConfirmData.created_at)}</Text>
          </Flex>
          {Object.keys(confirmDataPerBpp).map(key => (
            <Box key={confirmDataPerBpp[key].id}>
              <Flex pt={4} justifyContent={'space-between'} alignItems={'center'}>
                <Text>{t.ordersFulfilled}</Text>
                <Box>
                  <Text as={'span'} pr={'2px'}>
                    {statusResponse.filter((res: any) => res.message.order.state === 'DELIVERED').length}
                  </Text>
                  <Text as={'span'}>of</Text>
                  <Text as={'span'} pl={'2px'}>
                    {confirmData.length}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </CardBody>
      </Accordion>

      {statusResponse.map((res: any, index: number) => (
        <Accordion
          key={index}
          accordionHeader={
            <Box>
              <Flex mb={'15px'} fontSize={'17px'} alignItems={'center'}>
                <Text pr={'8px'}>{t.orderId}:</Text>

                <Text textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}>
                  {res.message.order.displayId}
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Flex maxWidth={'57vw'}>
                  <Text
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                    whiteSpace={'nowrap'}
                    fontSize={'12px'}
                    fontWeight={'400'}
                  >
                    {res.message.order.items[0].descriptor.name}
                  </Text>
                  <Text
                    pl={'5px'}
                    color={'rgba(var(--color-primary))'}
                    fontSize={'12px'}
                    fontWeight={'600'}
                    onClick={onOpen}
                  >
                    +{totalQuantityOfOrder(res) - 1}
                  </Text>
                </Flex>

                <Text
                  fontSize={'15px'}
                  fontWeight={'600'}
                  color={
                    res.message.order.state === 'INITIATED'
                      ? 'rgba(var(--pending-status-color))'
                      : 'rgba(var(--delivered-status-color))'
                  }
                >
                  {t[`${orderCardStatusMap[res.message.order.state]}`]}
                </Text>
              </Flex>
            </Box>
          }
        >
          <ViewMoreOrderModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            items={res.message.order.items}
            orderId={res.message.order.displayId}
          />
          <Divider mb={'20px'} />
          <CardBody pt={'unset'}>{RenderOrderStatusList(res)}</CardBody>
        </Accordion>
      ))}

      <Accordion accordionHeader={t.shipping}>
        <CardBody pt={'unset'} pb={'15px'}>
          <Box>
            <Stack divider={<StackDivider />} spacing="4">
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={nameIcon} pr={'12px'} />
                <Text fontSize={'17px'}>{shippingDetails.name}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={locationIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{shippingDetails.address}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={CallphoneIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{shippingDetails.phone}</Text>
              </Flex>
            </Stack>
          </Box>
        </CardBody>
      </Accordion>
      <Accordion accordionHeader={t.paymentText}>
        <CardBody pt={'unset'} pb={'unset'}>
          <Flex pb={'15px'} justifyContent={'space-between'} alignItems={'center'}>
            <Text>{t.subTotal}</Text>
            <Text>
              {t.currencySymbol}
              {subTotal}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'} alignItems={'center'} pb={'20px'}>
            <Text>{t.deliveryCharge}</Text>
            <Text>
              {t.currencySymbol}
              {totalDeliveryCharge}
            </Text>
          </Flex>
          <Divider />
        </CardBody>
        <CardBody pb={'unset'} pt={'15px'}>
          <Flex pb={'15px'} justifyContent={'space-between'} alignItems={'center'} fontSize={'17px'} fontWeight={'600'}>
            <Text>{t.total}</Text>
            <Text>
              {t.currencySymbol}
              {subTotal + totalDeliveryCharge}
            </Text>
          </Flex>
          <Flex fontSize={'15px'} justifyContent={'space-between'} alignItems={'center'} pb={'15px'}>
            <Text>{t.status}</Text>
            <Text>{orderState}</Text>
          </Flex>
          <Flex fontSize={'15px'} justifyContent={'space-between'} alignItems={'center'} pb={'15px'}>
            <Text>{t.paymentMethod}</Text>
            <Text>{t.cashOnDelivery}</Text>
          </Flex>
        </CardBody>
      </Accordion>
    </>
  )
}

export default OrderDetails
