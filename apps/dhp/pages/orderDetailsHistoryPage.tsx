import { Box, CardBody, Divider, Flex, Text, Image, Card, useDisclosure, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Accordion from '../components/accordion/Accordion'
import { useLanguage } from '../hooks/useLanguage'
import { ResponseModel } from '../lib/types/responseModel'
import {
  getConfirmMetaDataForBpp,
  getOrderPlacementTimeline,
  getPayloadForStatusRequest,
  getPayloadForTrackRequest
} from '../utilities/confirm-utils'
import { getDataPerBpp } from '../utilities/orderDetails-utils'
import { getSubTotalAndDeliveryChargesForOrder } from '../utilities/orderHistory-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
import { useSelector } from 'react-redux'
import { TransactionIdRootState } from '../lib/types/cart'
import useRequest from '../hooks/useRequest'
import Router, { useRouter } from 'next/router'
import DetailsCard from '../components/detailsCard/DetailsCard'
import Button from '../components/button/Button'
import Link from 'next/link'

const orderDetailsHistoryPage = () => {
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
  const [status, setStatus] = useState('progress')

  const { t } = useLanguage()

  // useEffect(() => {
  //   if (orderId && localStorage && localStorage.getItem('orderHistoryArray')) {
  //     const parsedOrderHistoryArray = JSON.parse(localStorage.getItem('orderHistoryArray') as string)

  //     const relatedOrder = parsedOrderHistoryArray.find((parsedOrder: any) => parsedOrder.parentOrderId === orderId)

  //     setConfirmData(relatedOrder.orders)

  //     const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(relatedOrder.orders)
  //     const payloadForStatusRequest = getPayloadForStatusRequest(confirmOrderMetaDataPerBpp, transactionId)
  //     const payloadForTrackRequest = getPayloadForTrackRequest(confirmOrderMetaDataPerBpp, transactionId)

  //     trackRequest.fetchData(`${apiUrl}/client/v2/track`, 'POST', payloadForTrackRequest)

  //     const intervalId = setInterval(() => {
  //       statusRequest.fetchData(`${apiUrl}/client/v2/status`, 'POST', payloadForStatusRequest)
  //     }, 2000)

  //     return () => {
  //       clearInterval(intervalId)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // useEffect(() => {
  //   if (localStorage) {
  //     const stringifiedConfirmData = localStorage.getItem('confirmData')
  //     if (stringifiedConfirmData) {
  //       const parsedConfirmedData = JSON.parse(stringifiedConfirmData)
  //       setConfirmData(parsedConfirmedData)

  //       const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(parsedConfirmedData)
  //       const payloadForStatusRequest = getPayloadForStatusRequest(confirmOrderMetaDataPerBpp, transactionId)
  //       const payloadForTrackRequest = getPayloadForTrackRequest(confirmOrderMetaDataPerBpp, transactionId)

  //       trackRequest.fetchData(`${apiUrl}/client/v2/track`, 'POST', payloadForTrackRequest)

  //       const intervalId = setInterval(() => {
  //         statusRequest.fetchData(`${apiUrl}/client/v2/status`, 'POST', payloadForStatusRequest)
  //       }, 2000)

  //       return () => {
  //         clearInterval(intervalId)
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // useEffect(() => {
  //   if (statusRequest.data) {
  //     setStatusResponse(statusRequest.data as any)
  //     if (statusRequest.data.every(res => res.message.order.state === 'DELIVERED')) {
  //       setAllOrderDelivered(true)
  //     }
  //   }
  // }, [statusRequest.data])

  // if (!confirmData.length) {
  //   return <></>
  // }

  // const confirmDataPerBpp = getDataPerBpp(confirmData)

  // const orderFromConfirmData = confirmData[0].message.responses[0].message.order

  // const { subTotal, totalDeliveryCharge } = getSubTotalAndDeliveryChargesForOrder(confirmData)

  // const orderState = orderFromConfirmData.payment.status

  // const totalQuantityOfOrder = (res: any) => {
  //   let count = 0
  //   res.message.order.items.forEach((item: any) => {
  //     count += item.quantity.count
  //   })
  //   return count
  // }

  // const getExtractedName = (str: string) => {
  //   const parts = str
  //     .trim()
  //     .split('/')
  //     .filter(part => part !== '')
  //   const extracted = parts[parts.length - 1]

  //   return extracted
  // }

  // const shippingDetails = {
  //   name: getExtractedName(orderFromConfirmData.billing.name),
  //   address: orderFromConfirmData.billing.address.state,
  //   phone: orderFromConfirmData.billing.phone
  // }

  // const handleViewCource = () => {
  //   let courseUrl = ''

  //   Object.keys(confirmDataPerBpp).map(key => {
  //     courseUrl = confirmDataPerBpp[key].items[0].tags.Url
  //   })

  //   window.open(courseUrl, '_blank')
  // }

  const handleViewPrescription = () => {
    Router.push('/PrescriptionPage')
  }
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {/* {allOrderDelivered ? ( */}
      <Card
        mb={'20px'}
        border={'1px solid rgba(94, 196, 1, 1)'}
        className="border_radius_all"
      >
        <CardBody padding={'15px 20px'}>
          <Flex
            alignItems={'center'}
            pb={'3px'}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              width={'12px'}
              height={'13px'}
              src={TrackIcon}
            />
            <Text
              pl={'8px'}
              fontSize={'17px'}
              fontWeight={'600'}
            >
              All orders delivered!
            </Text>
          </Flex>
          <Flex
            alignItems={'center'}
            fontSize={'15px'}
            pl={'20px'}
          >
            <Text>How did we do?</Text>
            <Text
              onClick={() => router.push('/feedback')}
              pl={'10px'}
              color={'rgba(var(--color-primary))'}
            >
              Rate Us
            </Text>
          </Flex>
        </CardBody>
      </Card>
      {/* ) : null} */}

      <DetailsCard>
        <Box
          fontWeight={600}
          fontSize={'17px'}
          pr={'8px'}
          pb="10px"
        >
          {t.orderSummary}
        </Box>
        <Flex
          pt={'unset'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text>{t.bookedIn}</Text>
          <Text>{/* {getOrderPlacementTimeline(orderFromConfirmData.created_at)} */}</Text>
        </Flex>
        {/* {Object.keys(confirmDataPerBpp).map(key => ( */}
        <Box
        //  key={confirmDataPerBpp[key].id}
        >
          <Flex
            pt={4}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text>{t.ordersFulfilled}</Text>
            <Box>
              <Text
                as={'span'}
                pr={'2px'}
              >
                {confirmData.length}
              </Text>
              <Text as={'span'}>of</Text>
              <Text
                as={'span'}
                pl={'2px'}
              >
                {confirmData.length}
              </Text>
            </Box>
          </Flex>
        </Box>
        {/* ))} */}
      </DetailsCard>

      {/* {statusResponse.map((res: any, index: number) => ( */}
      <DetailsCard>
        <Box>
          <Flex
            mb={'15px'}
            fontSize={'17px'}
            alignItems={'center'}
          >
            <Text
              fontWeight={600}
              fontSize={'17px'}
              pr={'8px'}
            >
              {t.orderId}:
            </Text>

            <Text
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              whiteSpace={'nowrap'}
              fontWeight={600}
            >
              {/* {res.message.order.displayId} */}
            </Text>
          </Flex>

          <Text
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
            fontSize={'12px'}
            fontWeight={'400'}
          >
            Physical Consultation
            {/* {res.message.order.items[0].descriptor.name} */}
          </Text>

          <Text
            fontSize={'12px'}
            fontWeight={'400'}
            pt={'5px'}
          >
            {'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016'}
          </Text>
        </Box>
      </DetailsCard>
      {/* ))} */}
      <DetailsCard>
        <Flex
          pb={'15px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text>{t.subTotal}</Text>
          <Text>
            {t.currencySymbol}
            00
            {/* {subTotal} */}
          </Text>
        </Flex>
        <Flex
          pb={'15px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Text>{t.taxes}</Text>
          <Text>
            {t.currencySymbol}
            00
            {/* {subTotal} */}
          </Text>
        </Flex>
        <Divider />

        <Flex
          mt={'15px'}
          justifyContent={'space-between'}
          alignItems={'center'}
          fontSize={'17px'}
          fontWeight={'600'}
        >
          <Text>{t.total}</Text>
          <Text>
            {t.currencySymbol}
            0.00
          </Text>
        </Flex>
      </DetailsCard>
      <Button
        buttonText={t.viewPrescription}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleViewPrescription}
      />
    </Box>
  )
}

export default orderDetailsHistoryPage
