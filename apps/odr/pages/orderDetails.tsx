import { Box, CardBody, Divider, Flex, Text, Image, Card, Stack, HStack, StackDivider } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { ResponseModel } from '../lib/types/responseModel'
import { convertTimestampToDdMmYyyyHhMmPM } from '../utilities/confirm-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import useRequest from '../hooks/useRequest'
import { useRouter } from 'next/router'
import DetailsCard from '../components/detailsCard/DetailsCard'
import attached from '../public/images/attached.svg'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import { RenderOrderStatusList } from '../components/orderDetails/RenderOrderStatusTree'
import Loader from '../components/loader/Loader'
import Accordion from '../components/accordion/Accordion'

const OrderDetails = () => {
  const [allOrderDelivered, setAllOrderDelivered] = useState(false)
  const [statusResponse, setStatusResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [complainantAddress, setComplainantAddress] = useState<any>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const statusRequest = useRequest()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    let intervalId: any
    let payloadIndex = 1 // Start with the second payload after the initial call

    const fetchDataWithPayload = (payload: any, confirmData: any) => {
      const payloadForStatusRequest = {
        scholarshipApplicationId: confirmData?.scholarshipApplicationId,
        context: {
          transactionId: confirmData?.context?.transactionId,
          bppId: confirmData.context.bppId,
          key: payload.key,
          bppUri: confirmData?.context?.bppUri
        }
      }

      statusRequest.fetchData(`${apiUrl}/status`, 'POST', payloadForStatusRequest)
    }

    const payloads = [
      {
        key: 'in-progress'
      },
      {
        key: 'in-progress-payment-after-hearing'
      },
      {
        key: 'completed'
      }
    ]

    if (localStorage) {
      const stringifiedConfirmData = localStorage.getItem('confirmData')
      if (stringifiedConfirmData) {
        try {
          const parsedConfirmedData = JSON.parse(stringifiedConfirmData)

          // Initial status call
          fetchDataWithPayload({ key: 'in-progress' }, parsedConfirmedData)

          // Setup interval for subsequent calls
          intervalId = setInterval(() => {
            const currentPayload = payloads[payloadIndex]

            fetchDataWithPayload(currentPayload, parsedConfirmedData)

            payloadIndex += 1

            if (payloadIndex === payloads.length) {
              clearInterval(intervalId)
            }
          }, 5000)
        } catch (error) {
          console.error('Error parsing confirmData:', error)
        }
      }
    }

    return () => {
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (statusRequest.data) {
      setIsLoading(false)
      setStatusResponse(statusRequest.data as any)
      // if (statusRequest.data.every(res => res.scholarshipProvider.scholarship[].state === '')) {
      //   setAllOrderDelivered(true)
      // }
    }
  }, [statusRequest.data])

  useEffect(() => {
    if (statusResponse) {
      if (
        statusResponse.scholarshipProviders[0].scholarships[0].scholarshipDetails.state.code === 'arbitration-completed'
      ) {
        setAllOrderDelivered(true)
      }
    }
  }, [statusResponse])

  useEffect(() => {
    if (localStorage && localStorage.getItem('billingAddress')) {
      const billingAdress = JSON.parse(localStorage.getItem('billingAddress') as string)
      setComplainantAddress(billingAdress)
    }
  }, [])

  const handleDetails = (url: string) => {
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <Loader>
        <Box
          mt={'13px'}
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
        >
          <Text fontWeight={700}>Please wait!</Text>
          <Text>while we update the current</Text>
          <Text>status of your case.</Text>
        </Box>
      </Loader>
    )
  }

  const { caseDocs, context, scholarshipApplicationId, scholarshipProviders, createdAt } = statusResponse as any
  const { scholarships, name } = scholarshipProviders[0]

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
                All requests have been fulfilled!
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
            gap={'10px'}
          >
            <Text
              fontSize={'15px'}
              fontWeight={400}
            >
              {name}
            </Text>
            <Box>
              <Text
                fontSize={'15px'}
                fontWeight={400}
                as={'span'}
                pr={'2px'}
              >
                {scholarships[0].name}, {scholarships[0].categories[0].descriptor.name}
              </Text>
            </Box>
            <Text
              fontSize={'15px'}
              fontWeight={400}
            >
              Case ID: {`#${statusResponse.scholarshipApplicationId}`}
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
                {convertTimestampToDdMmYyyyHhMmPM(createdAt)}
              </Text>
            </HStack>
          </Flex>
        </Box>
      </DetailsCard>
      <DetailsCard>
        <HStack
          pb="10px"
          justifyContent={'space-between'}
        >
          <Text
            fontWeight={600}
            fontSize={'17px'}
          >
            {t.caseId}: {scholarshipProviders[0].id}
          </Text>
          <Flex>
            {statusResponse.scholarshipProviders[0].scholarships[0].scholarshipDetails.state.code ===
            'arbitration-completed' ? (
              <Image
                src="/images/approvedIcon.svg"
                alt=""
                pr={'6px'}
              />
            ) : (
              <Image
                src="/images/inProgress.svg"
                alt=""
                pr={'6px'}
              />
            )}
            <Text
              fontWeight={300}
              fontSize={'12px'}
            >
              {statusResponse.scholarshipProviders[0].scholarships[0].scholarshipDetails.state.code ===
              'arbitration-completed'
                ? 'Case Closed'
                : 'In Progress'}
            </Text>
          </Flex>
        </HStack>
        <Text
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          fontSize={'12px'}
          fontWeight={'400'}
        ></Text>
        <Divider
          mt={'15px'}
          mb={'15px'}
        />
        <CardBody pt={'unset'}>{RenderOrderStatusList(statusResponse)}</CardBody>
      </DetailsCard>
      {/* TODO :- change this */}
      <ShippingOrBillingDetails
        accordionHeader={'Complainant & Billing Details'}
        name={complainantAddress ? complainantAddress.name : 'Marie Sampath'}
        location={complainantAddress ? complainantAddress.address : '2111, HSR Layout, Sector 2, Bangalore'}
        number={complainantAddress ? complainantAddress.mobileNumber : '9876543210'}
      />

      {statusResponse?.caseDocs?.length
        ? statusResponse?.caseDocs?.map((item: any, i: any) => (
            <Accordion
              accordionHeader={item.descriptor.name}
              key={i}
            >
              <Stack
                divider={<StackDivider />}
                spacing="4"
              >
                <Flex
                  p={'15px'}
                  onClick={() => handleDetails(item.url)}
                >
                  <Image src={attached} />
                  <Text fontSize={'15px'}>{item.descriptor.name} Added</Text>
                </Flex>
              </Stack>
            </Accordion>
          ))
        : null}
    </Box>
  )
}

export default OrderDetails
