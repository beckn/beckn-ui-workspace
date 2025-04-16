import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Flex,
  Spinner,
  Center,
  VStack,
  Divider,
  Image,
  Card,
  CardBody,
  Heading,
  Stack,
  useTheme
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import type { OrderDetails as OrderDetailsType } from '@lib/types/orderDetails'
import ChargingIcon from '@public/images/charging_icon.svg'
import PaidIcon from '@public/images/paid.svg'
import { currencyMap, DOMAIN } from '@lib/config'
import { getCountryCode } from '@utils/general'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useRouter } from 'next/router'
import axios from '@services/axios'
import { ConfirmResponseModel, getPayloadForOrderStatus } from '@beckn-ui/common'
import { UserRootState } from '@store/user-slice'
import { useSelector } from 'react-redux'

const OrderDetails = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{ confirmData: ConfirmResponseModel[]; statusData: OrderDetailsType | null }>({
    confirmData: [],
    statusData: null
  })
  const [isError, setIsError] = useState<string | null>(null)

  const router = useRouter()
  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]
  const { currentLocation } = useSelector((state: UserRootState) => state.user)

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
                transaction_id: uuidv4(),
                bpp_id: bppId,
                bpp_uri: bppUri,
                domain: DOMAIN,
                location: getCountryCode()
              },
              message: {
                order_id: orderId,
                orderId: orderId
              }
            }
          ]
        }
        setIsLoading(true)
        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError('')
            }
            const resData = res?.data?.data?.[0]?.message.order
            console.log('resData', resData)
            setData(prevState => ({
              ...prevState,
              statusData: {
                chargingDetails: {
                  consumedUnit: resData.items?.[0]?.quantity?.selected?.measure?.value || 0,
                  bookingTime: resData.bookingTime,
                  totalCost: resData.quote?.price?.value * Number(resData.items?.[0]?.quantity.selected.measure.value),
                  chargerId: resData.items?.[0]?.id,
                  chargerName: resData.items?.[0]?.name,
                  stationId: resData.id,
                  stationName: resData.provider.name,
                  power: resData.power,
                  portType:
                    resData?.items?.[0]?.tags?.[0]?.list?.[0]?.name || resData?.items?.[0]?.tags?.[0]?.list?.[0]?.value,
                  status:
                    resData.fulfillments?.[0].state.descriptor.code === 'CHARGING_STATUS' &&
                    resData.fulfillments?.[0].state.descriptor.short_desc === '100'
                      ? 'Completed'
                      : 'In Progress'
                },
                paymentDetails: {
                  method: 'Card',
                  transactionId: resData.transactionId,
                  totalCost: resData.quote?.price?.value * Number(resData.items?.[0]?.quantity.selected.measure.value),
                  status: 'Paid'
                },
                locationDetails: {
                  address: resData.billing?.address,
                  latitude: resData.items?.[0].locations?.[0]?.gps?.split(',')?.[0],
                  longitude: resData.items?.[0].locations?.[0]?.gps?.split(',')?.[1]
                }
              }
            }))
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
      if (data.confirmData && data.confirmData.length > 0) {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        const statusPayload = getPayloadForOrderStatus(parsedConfirmData, {
          location: getCountryCode()
        })
        setIsLoading(true)

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            if (JSON.stringify(res.data) === '{}') {
              return setIsError('')
            }
            const resData = res?.data?.data?.[0]?.message.order
            console.log('resData', resData)
            setData(prevState => ({
              ...prevState,
              statusData: {
                chargingDetails: {
                  consumedUnit: resData.items?.[0]?.quantity.selected.measure?.value,
                  bookingTime: resData.duration,
                  totalCost: resData.quote?.price?.value * Number(resData.items?.[0]?.quantity.selected.measure.value),
                  chargerId: resData.items?.[0]?.id,
                  chargerName: resData.items?.[0]?.name,
                  stationId: resData.id,
                  stationName: resData.provider.name,
                  power: resData.power,
                  portType:
                    resData?.items?.[0]?.tags?.[0]?.list?.[0]?.name || resData?.items?.[0]?.tags?.[0]?.list?.[0]?.value,
                  status:
                    resData.fulfillments?.[0].state.descriptor.code === 'CHARGING_STATUS' &&
                    resData.fulfillments?.[0].state.descriptor.short_desc === '100'
                      ? 'Completed'
                      : 'In Progress'
                },
                paymentDetails: {
                  method: 'Card',
                  transactionId: resData.transactionId,
                  totalCost: resData.quote?.price?.value * Number(resData.items?.[0]?.quantity.selected.measure.value),
                  status: 'Paid'
                },
                locationDetails: {
                  address: resData.billing?.address,
                  latitude: resData.fulfillments?.[0].stops?.[0]?.location?.gps?.split(',')[0],
                  longitude: resData.fulfillments?.[0].stops?.[0]?.location?.gps?.split(',')[1]
                }
              }
            }))

            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    }

    fetchData()

    // const intervalId = setInterval(fetchData, 60000)

    // return () => clearInterval(intervalId)
  }, [apiUrl, data.confirmData])

  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner
          size="xl"
          color="blue.500"
        />
      </Center>
    )
  }

  if (isError || !data) {
    return (
      <Center h="calc(100vh - 100px)">
        <Text color="red.500">{isError || 'No data available'}</Text>
      </Center>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
      p={'10px 10px'}
    >
      {/* Charging Icon */}
      <Center mb={6}>
        <Box
          position="relative"
          width="80px"
          height="80px"
        >
          <Image
            src={ChargingIcon}
            alt="Charging Icon"
            objectFit="contain"
          />
        </Box>
      </Center>

      {/* Charging Details Section */}

      {/* Charging Details Card */}
      <Card
        borderRadius="lg"
        boxShadow="md"
        overflow="hidden"
        marginTop={2}
      >
        <CardBody p={'10px'}>
          <Flex
            flexDir={'row'}
            justifyContent={'space-between'}
          >
            <Heading
              mb={4}
              fontSize={'16px'}
              fontWeight="400"
            >
              Charging Details
            </Heading>
            <Box
              bgColor={data.statusData?.chargingDetails.status === 'In Progress' ? '#FFF9CC' : '#D2F9EA'}
              px={2}
              py={1}
              borderRadius="4px"
              height={'fit-content'}
            >
              <Text
                fontSize="10px"
                fontWeight="400"
                whiteSpace="nowrap"
                color={data.statusData?.chargingDetails.status === 'In Progress' ? '#807000' : '#11704C'}
              >
                {data.statusData?.chargingDetails.status}
              </Text>
            </Box>
          </Flex>
          <Stack spacing={1}>
            {data.statusData?.chargingDetails.consumedUnit && (
              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Consumed Unit
                </Text>
                <Text
                  color={'#797979'}
                  fontWeight={'500'}
                >
                  {data.statusData?.chargingDetails.consumedUnit} Kwh
                </Text>
              </Flex>
            )}

            {data.statusData?.chargingDetails.bookingTime && (
              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Booking Time
                </Text>
                <Text
                  color={'#797979'}
                  fontWeight={'500'}
                >
                  {data.statusData?.chargingDetails.bookingTime} mins
                </Text>
              </Flex>
            )}

            <Flex justify="space-between">
              <Text
                color="#595959"
                fontWeight={'500'}
              >
                Station Name
              </Text>
              <Text
                color={'#797979'}
                fontWeight={'500'}
              >
                {data.statusData?.chargingDetails.stationName}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                color="#595959"
                fontWeight={'500'}
              >
                Charger Name
              </Text>
              <Text
                color={'#797979'}
                fontWeight={'500'}
              >
                {data.statusData?.chargingDetails.chargerName}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text
                color="#595959"
                fontWeight={'500'}
              >
                Total Cost
              </Text>
              <Text
                color={'#4461F2'}
                fontWeight={'600'}
              >
                {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                {data.statusData?.chargingDetails.totalCost}
              </Text>
            </Flex>

            <Box
              mt={2}
              bg="#F0F0F0"
              borderRadius="md"
              p={'10px'}
            >
              <Flex justify="space-between">
                <Flex
                  textAlign="center"
                  flex={1}
                  flexDirection={'column'}
                  gap={'10px'}
                >
                  <Text
                    color={'#595959'}
                    fontWeight={'500'}
                  >
                    {data.statusData?.chargingDetails.chargerId}
                  </Text>
                  <Text
                    color="#797979"
                    fontSize="12px"
                  >
                    Charger ID
                  </Text>
                </Flex>

                <Divider
                  orientation="vertical"
                  borderColor="#BFBFBF"
                  height="50px"
                  margin="0 10px"
                />
                {/* <Flex
                  textAlign="center"
                  flex={1}
                  borderX="1px"
                  borderColor="gray.200"
                  flexDirection={'column'}
                  gap={'10px'}
                >
                  <Text
                    color={'#595959'}
                    fontWeight={'500'}
                  >
                    {data.statusData?.chargingDetails.power}
                  </Text>
                  <Text
                    color="#797979"
                    fontSize="12px"
                  >
                    Power
                  </Text>
                </Flex> */}
                <Divider
                  orientation="vertical"
                  borderColor="gray.200"
                />

                <Flex
                  textAlign="center"
                  flex={1}
                  flexDirection={'column'}
                  gap={'10px'}
                >
                  <Text
                    color={'#595959'}
                    fontWeight={'500'}
                  >
                    {data.statusData?.chargingDetails.portType}
                  </Text>
                  <Text
                    color="#797979"
                    fontSize="12px"
                  >
                    Port Type
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      {/* Payment Section */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        mb={4}
        boxShadow="sm"
        border="1px"
        borderColor="gray.100"
      >
        <Flex
          justify="space-between"
          align="center"
          mb={4}
        >
          <Text
            fontSize="16px"
            fontWeight="400"
          >
            Payment
          </Text>
          <Box
            bg="#D2F9EA"
            px={2}
            py={1}
            borderRadius="4px"
            display={'flex'}
            flexDir={'row'}
            alignItems={'center'}
            gap="0.5"
          >
            {data.statusData?.paymentDetails.status === 'Paid' && (
              <Image
                src={PaidIcon}
                alt="paid_icon"
                width={'10px'}
                height={'10px'}
              />
            )}
            <Text
              fontSize="10px"
              color="#11704C"
            >
              {data.statusData?.paymentDetails.status}
            </Text>
          </Box>
        </Flex>

        <VStack
          spacing={1}
          align="stretch"
        >
          <Flex justify="space-between">
            <Text
              color="#595959"
              fontWeight={'500'}
            >
              Method
            </Text>
            <Text
              color={'#797979'}
              fontWeight={'500'}
            >
              {data.statusData?.paymentDetails.method}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text
              color="#595959"
              fontWeight={'500'}
            >
              Transaction ID
            </Text>
            <Text
              color={'#797979'}
              fontWeight={'500'}
            >
              {data.statusData?.paymentDetails.transactionId}
            </Text>
          </Flex>
          <Divider />
          <Flex justify="space-between">
            <Text
              color="#595959"
              fontWeight={'500'}
            >
              Total Cost:
            </Text>
            <Text
              color={primaryColor}
              fontWeight={'600'}
            >
              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
              {data.statusData?.paymentDetails.totalCost}
            </Text>
          </Flex>
        </VStack>
      </Box>

      {/* Location Section */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        boxShadow="sm"
        border="1px"
        borderColor="gray.100"
      >
        <Text
          fontSize="16px"
          fontWeight="400"
          mb={4}
        >
          Charging Station Location
        </Text>
        <Text
          color="gray.600"
          mb={4}
        >
          {data.statusData?.locationDetails.address}
        </Text>
        <BecknButton
          text="Navigate"
          handleClick={() => {
            router.push({
              pathname: '/navigation',
              query: {
                origin: JSON.stringify(currentLocation),
                destination: JSON.stringify(data.statusData?.locationDetails)
              }
            })
          }}
          rightIcon={
            <Box
              position="relative"
              width="20px"
              height="20px"
            >
              <Image
                src="/images/history_nav_icon.svg"
                alt="Navigate"
                objectFit="contain"
              />
            </Box>
          }
        />
      </Box>
    </Box>
  )
}

export default OrderDetails
