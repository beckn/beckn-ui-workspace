import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Progress,
  Image,
  Flex,
  Card,
  CardBody,
  Heading,
  Stack,
  useTheme,
  Divider
} from '@chakra-ui/react'
import ChargingIcon from '@public/images/charging_icon.svg'
import ProgressIcon from '@public/images/charging_progress_icon.svg'
import { currencyMap, DOMAIN } from '@lib/config'
import { getCountryCode } from '@utils/general'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { CheckoutRootState } from '@beckn-ui/common/src/store'
import { v4 as uuidv4 } from 'uuid'

interface ChargingDetails {
  consumedUnit: number
  bookingTime: number
  totalCost: number
  chargerId: string
  chargerName: string
  stationId: string
  stationName: string
  power: string
  portType: string
}

type ChargingState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

const MonitorCharging = () => {
  const [chargingState, setChargingState] = useState<ChargingState>('NOT_STARTED')
  const [chargingProgress, setChargingProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(30)
  const [chargingDetails, setChargingDetails] = useState<ChargingDetails>({
    consumedUnit: 0,
    bookingTime: 0,
    totalCost: 0,
    chargerId: '',
    chargerName: '',
    stationId: '',
    stationName: '',
    power: '',
    portType: ''
  })

  const router = useRouter()
  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const confirmOrderData = JSON.parse(localStorage.getItem('confirmResponse') as string)
      const { message } = confirmOrderData[0]
      setChargingDetails(prev => ({
        ...prev,
        consumedUnit: parseFloat(message.items?.[0]?.quantity.selected.measure.value),
        stationId: message.id,
        stationName: message.provider.name,
        chargerId: message.items?.[0]?.id,
        chargerName: message.items?.[0]?.name,
        power: message.power,
        portType: message.items?.[0]?.tags?.[0]?.list?.[0]?.name || message.items?.[0]?.tags?.[0]?.list?.[0]?.value,
        totalCost:
          parseFloat(message.quote?.price?.value) * parseFloat(message.items?.[0]?.quantity.selected.measure.value)
      }))
    }
  }, [])

  const fetchStatus = async () => {
    console.log('fetchStatus')
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

      try {
        const response = await axios.post(`${apiUrl}/status`, statusPayload)
        const statusData = response.data.data[0]

        if (statusData) {
          console.log('statusData', statusData)
          const statusDetails = statusData.message.order.fulfillments[0].state.descriptor
          if (statusDetails.code === 'CHARGING_STATUS') {
            const newProgress = parseInt(statusDetails.short_desc)

            if (!isNaN(newProgress)) {
              setChargingProgress(newProgress)
              setRemainingTime(Math.max(0, 60 - newProgress * 0.6))

              if (newProgress >= 100) {
                setChargingState('COMPLETED')
                setChargingDetails(prev => ({
                  ...prev,
                  consumedUnit: parseFloat(statusData.message.order.items?.[0]?.quantity.selected.measure.value),
                  bookingTime: statusData.message.order.duration,
                  totalCost:
                    parseFloat(statusData.message.order.quote?.price?.value) *
                    parseFloat(statusData.message.order.items?.[0]?.quantity.selected.measure.value),
                  chargerId: statusData.message.order.items?.[0]?.id,
                  chargerName: statusData.message.order.items?.[0]?.name,
                  stationId: statusData.message.order.id,
                  stationName: statusData.message.order.provider.name,
                  power: '0',
                  portType:
                    statusData.message.order.items?.[0]?.tags?.[0]?.list?.[0]?.name ||
                    statusData.message.order.items?.[0]?.tags?.[0]?.list?.[0]?.value
                }))
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching charging status:', error)
      }
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (chargingState === 'IN_PROGRESS') {
      intervalId = setInterval(fetchStatus, 3000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [chargingState, confirmResponse])

  const handleChargingAction = () => {
    if (chargingState === 'NOT_STARTED') {
      setChargingState('IN_PROGRESS')
    } else if (chargingState === 'COMPLETED') {
      localStorage.setItem('selectedRoute', '/orderHistory')
      router.push('/orderHistory')
    }
  }

  const getButtonText = () => {
    switch (chargingState) {
      case 'NOT_STARTED':
        return 'Start Charging'
      case 'IN_PROGRESS':
        return 'End Charging'
      case 'COMPLETED':
        return 'View Charging History'
    }
  }

  const getStatusText = () => {
    switch (chargingState) {
      case 'NOT_STARTED':
        return 'Start Charging'
      case 'IN_PROGRESS':
        return 'Charging In Progress'
      case 'COMPLETED':
        return 'Charging Completed'
    }
  }

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'space-between'}
      height={'calc(100vh - 110px)'}
    >
      <Flex flexDir={'column'}>
        {/* Charging Icon and Status */}
        <VStack
          spacing={1}
          align="center"
          marginTop={2}
        >
          <Box
            position="relative"
            w="80px"
            h="80px"
          >
            <Image
              src={ChargingIcon}
              alt="Charging Icon"
              width={'80px'}
              height={'80px'}
            />
          </Box>
          <Flex
            flexDir={'row'}
            gap="2px"
            placeItems={'center'}
          >
            <Image
              src={ProgressIcon}
              alt="Progress Icon"
              width={'20px'}
              height={'20px'}
            />
            <Text
              color="green.500"
              fontWeight="medium"
            >
              {getStatusText()}
            </Text>
          </Flex>
        </VStack>

        {/* Progress Bar */}
        <Box alignSelf={'center'}>
          <Flex
            flexDir={'row'}
            gap={2}
            alignItems={'center'}
          >
            <Progress
              value={chargingProgress}
              size="sm"
              colorScheme={'blue'}
              borderRadius="full"
              w={'100%'}
            />
            <Text
              textAlign="right"
              fontSize={'12px'}
              fontWeight={'500'}
            >
              {chargingProgress}%
            </Text>
          </Flex>
          <Text
            fontSize={'12px'}
            fontWeight="500"
            mt={1}
          >
            Remaining Time: {remainingTime} mins
          </Text>
        </Box>

        {/* Charging Details Card */}
        <Card
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
          marginTop={2}
        >
          <CardBody p={'10px'}>
            <Heading
              size="md"
              mb={4}
              fontSize={'16px'}
              fontWeight="400"
            >
              Charging Details
            </Heading>

            <Stack spacing={1}>
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
                  {chargingDetails.consumedUnit} Kwh
                </Text>
              </Flex>

              {chargingDetails.bookingTime && (
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
                    {chargingDetails.bookingTime} mins
                  </Text>
                </Flex>
              )}

              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Total Cost
                </Text>
                <Text
                  color={'#4461F2'}
                  fontWeight={'500'}
                >
                  {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                  {chargingDetails.totalCost}
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
                      {chargingDetails.chargerId}
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
                      {chargingDetails.portType}
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
      </Flex>
      {/* Action Button */}
      <Flex
        flexDir={'column'}
        gap={2}
      >
        {chargingState === 'COMPLETED' && (
          <BecknButton
            text="Go Home"
            variant="outline"
            handleClick={() => {
              localStorage.setItem('selectedRoute', '/')
              router.push('/')
            }}
          />
        )}
        <BecknButton
          text={getButtonText()}
          variant="solid"
          handleClick={handleChargingAction}
          disabled={chargingState === 'IN_PROGRESS'}
          sx={{
            bg:
              chargingState === 'NOT_STARTED' ? '#43B620' : chargingState === 'IN_PROGRESS' ? '#F24447' : primaryColor,
            color: 'white'
          }}
        />
      </Flex>
    </Flex>
  )
}

export default MonitorCharging
