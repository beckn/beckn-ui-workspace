import {
  Box,
  CardBody,
  Divider,
  Flex,
  Text,
  Image,
  Card,
  useDisclosure,
  Stack,
  HStack,
  StackDivider
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Accordion from '../components/accordion/Accordion'
import { useLanguage } from '../hooks/useLanguage'
import { ResponseModel } from '../lib/types/responseModel'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'
import { getDataPerBpp } from '../utilities/orderDetails-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import { useSelector } from 'react-redux'
import { TransactionIdRootState } from '../lib/types/cart'
import useRequest from '../hooks/useRequest'
import { useRouter } from 'next/router'
import DetailsCard from '../components/detailsCard/DetailsCard'
import attached from '../public/images/attached.svg'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import { RenderOrderStatusList } from '../components/orderDetails/RenderOrderStatusTree'

const OrderDetails = () => {
  const [allOrderDelivered, setAllOrderDelivered] = useState(true)
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

  useEffect(() => {
    const fetchStatusData = async () => {
      if (localStorage) {
        const stringifiedConfirmData = localStorage.getItem('confirmData')
        if (stringifiedConfirmData) {
          try {
            const parsedConfirmedData = JSON.parse(stringifiedConfirmData)
            setConfirmData(parsedConfirmedData)

            const payloadForStatusRequest = {
              scholarshipApplicationId: parsedConfirmedData?.scholarshipApplicationId,
              context: {
                transactionId: transactionId?.transactionId,
                bppId: parsedConfirmedData.context.bppId,
                key: 'completed',
                bppUri: parsedConfirmedData?.context?.bppUri
              }
            }

            const intervalId = setInterval(() => {
              statusRequest.fetchData(`${apiUrl}/status`, 'POST', payloadForStatusRequest)
            }, 2000)

            return () => {
              clearInterval(intervalId)
            }
          } catch (error) {
            console.error('Error parsing confirmData:', error)
          }
        }
      }
    }

    fetchStatusData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (statusRequest.data) {
  //     setStatusResponse(statusRequest.data as any)
  //     if (statusRequest.data.every(res => res.message.order.state === 'DELIVERED')) {
  //       setAllOrderDelivered(true)
  //     }
  //   }
  // }, [statusRequest.data])

  if (!confirmData.length) {
    return <></>
  }

  const confirmDataPerBpp = getDataPerBpp(confirmData)

  const orderFromConfirmData = confirmData[0].message.responses[0].message.order

  const orderState = orderFromConfirmData.payment.status

  console.log(statusResponse)
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {allOrderDelivered ? (
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
                All request have been fulfilled!
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
      ) : null}

      <DetailsCard>
        <Box
          fontWeight={600}
          fontSize={'17px'}
          pr={'8px'}
          pb="10px"
        >
          {t.caseSummary}
        </Box>
        <Box>
          <Flex
            flexDir={'column'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
          >
            <Text
              fontSize={'15px'}
              fontWeight={400}
            >
              {confirmData?.scholarshipProvider?.scholarships[0]?.name}
            </Text>
            <Box>
              <Text
                fontSize={'15px'}
                fontWeight={400}
                as={'span'}
                pr={'2px'}
              >
                {confirmData?.scholarshipProvider?.scholarships[0]?.categories[0]?.descriptor?.name}
              </Text>
            </Box>
            <Text
              fontSize={'15px'}
              fontWeight={400}
            >
              Case Id: {confirmData?.scholarshipProvider?.scholarships[0]?.categories[0]?.id}
            </Text>
            <HStack
              justifyContent={'space-between'}
              gap={'3.5rem'}
            >
              <Text
                fontSize={'15px'}
                fontWeight={400}
              >
                {t.lodgedOn}
              </Text>
              <Text
                fontSize={'15px'}
                fontWeight={400}
              >
                {getOrderPlacementTimeline(confirmData?.created_at)}
              </Text>
            </HStack>
          </Flex>
        </Box>
      </DetailsCard>
      {/* <DetailsCard>
      {statusResponse.map((res: any, index: number) => (
        <>
          <HStack
            pb="10px"
            key={index}
            justifyContent={'space-between'}
          >
            <Text
              fontWeight={600}
              fontSize={'17px'}
            >
              {t.caseId} {res.message.order.displayId}
            </Text>
            <Flex>
              {res.message.order.state === 'INITIATED' ? (
                <Image
                  src="/images/inProgress.svg"
                  alt=""
                  pr={'6px'}
                />
              ) : (
                <Image
                  src="/images/approvedIcon.svg"
                  alt=""
                  pr={'6px'}
                />
              )}
              <Text
                fontWeight={300}
                fontSize={'12px'}
              >
                {res.message.order.state === 'INITIATED' ? 'In Progress' : 'Case Closed'}
              </Text>
            </Flex>
          </HStack>
          <Text
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            whiteSpace={'nowrap'}
            fontSize={'12px'}
            fontWeight={'400'}
          >
            {res.message.order.items[0].descriptor.name}
          </Text>
          <Divider
            mt={'15px'}
            mb={'15px'}
          />
          <CardBody pt={'unset'}>{RenderOrderStatusList(res)}</CardBody>
        </>
      ))}
    </DetailsCard> */}
      <ShippingOrBillingDetails
        accordionHeader={'Complainant & Billing Details'}
        name={confirmData?.billingDetails?.name}
        location={confirmData?.billingDetails?.address}
        number={confirmData?.billingDetails?.mobileNumber}
      />

      <ShippingOrBillingDetails
        accordionHeader={'Dispute Details'}
        name={confirmData?.billingDetails?.name}
        location={confirmData?.billingDetails?.address} // it should be dispute Details "need to discuss"
        number={'+91 9871432309'}
      />
      <Accordion accordionHeader={'Dispute Details'}>
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Flex p={'15px'}>
            <Image src={attached} />
            <Text fontSize={'15px'}>Dispute details added</Text>
          </Flex>
        </Stack>
      </Accordion>
      <Accordion accordionHeader={'Consent'}>
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Flex p={'15px'}>
            <Image src={attached} />
            <Text fontSize={'15px'}>Consent Form Filled</Text>
          </Flex>
        </Stack>
      </Accordion>
    </Box>
  )
}

export default OrderDetails
