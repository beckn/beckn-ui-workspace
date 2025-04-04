import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import completedIcon from '../../public/images/completed.svg'
import pendingIcon from '../../public/images/pendingYellow.svg'
import React from 'react'
import { currencyMap } from '@lib/config'
import { getCountryCode } from '@utils/general'

export type OrderItem = {
  batteryType: string
  capacity: string
  rentedFrom: string
  timeSlot: string
  duration: string
  price?: string
  status?: string
}

type OrderOverviewProps = {
  items: OrderItem[]
  showPriceAndStatus?: boolean
}

const orderStatusIcons: Record<string, string> = {
  PAID: completedIcon,
  NON_PAID: pendingIcon
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ items, showPriceAndStatus = true }) => {
  return (
    <>
      {items.map((item, index) => (
        <DetailCard key={index}>
          <Box>
            <Typography
              text={item.batteryType}
              fontSize="17px"
              fontWeight="600"
            />
            <Typography
              text={item.capacity}
              fontSize="12px"
              fontWeight="400"
              color="gray.600"
              sx={{ mb: 3 }}
            />

            <Flex
              mb={3}
              alignItems="center"
            >
              <Typography
                text="Rented from:"
                fontSize="12px"
                fontWeight="600"
              />
              <Typography
                text={` ${item.rentedFrom}`}
                fontSize="12px"
                fontWeight="400"
                sx={{ ml: 1 }}
              />
            </Flex>

            <Flex
              mb={3}
              alignItems="center"
            >
              <Typography
                text="Time Slot:"
                fontSize="12px"
                fontWeight="600"
              />
              <Typography
                text={` ${item.timeSlot}`}
                fontSize="12px"
                sx={{ ml: 1 }}
              />
            </Flex>

            <Flex
              mb={3}
              alignItems="center"
            >
              <Typography
                text="Duration:"
                fontSize="12px"
                fontWeight="600"
              />
              <Typography
                text={` ${item.duration}`}
                fontSize="12px"
                sx={{ ml: 1 }}
              />
            </Flex>
          </Box>

          {showPriceAndStatus && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Typography
                color="#4398E8"
                text={`${currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}${item.price}`}
              />
              <Flex alignItems="center">
                <Image
                  src={orderStatusIcons[item.status || 'NON_PAID']}
                  paddingRight="6px"
                  boxSize="20px"
                />
                <Typography text={item.status === 'PAID' ? 'Completed' : 'Pending'} />
              </Flex>
            </Flex>
          )}
        </DetailCard>
      ))}
    </>
  )
}

export default OrderOverview

export const mapOrderData = (data: any[]): OrderItem[] => {
  return data.map(order => {
    try {
      const item = order.items[0]
      const fulfillmentStart = item.fulfillments?.find(f => f.type === 'RENTAL_START' && f.state)
      const fulfillmentEnd = item.fulfillments?.find(f => f.type === 'RENTAL_END' && f.state)

      let startTimestamp = fulfillmentStart ? Number(fulfillmentStart.state?.name || 0) : null
      let endTimestamp = fulfillmentEnd ? Number(fulfillmentEnd.state?.name || 0) : null

      if (startTimestamp && startTimestamp > 9999999999) startTimestamp = Math.floor(startTimestamp / 1000)
      if (endTimestamp && endTimestamp > 9999999999) endTimestamp = Math.floor(endTimestamp / 1000)

      const formatTime = (timestamp: number | null) => {
        if (!timestamp) return 'N/A'
        const date = new Date(timestamp * 1000)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }

      const startTime = formatTime(startTimestamp)
      const endTime = formatTime(endTimestamp)
      const calculatedDuration = startTimestamp && endTimestamp ? Math.round((endTimestamp - startTimestamp) / 3600) : 0
      const duration = calculatedDuration ? calculatedDuration + ' hr' : 'N/A'
      const paymentStatus = order.payments.some(payment => payment.status === 'PAID') ? 'PAID' : 'NON_PAID'

      return {
        batteryType: item.name,
        capacity: item.code,
        rentedFrom: order.descriptor.name,
        timeSlot: `${startTime} - ${endTime}`,
        duration,
        price: `${Number(order.quote.price.value) * Number(calculatedDuration)}`,
        status: paymentStatus
      }
    } catch (error) {
      console.error('Error mapping order data:', error)
      return {} as OrderItem
    }
  })
}
