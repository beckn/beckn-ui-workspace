import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import completedIcon from '../../public/images/completed.svg'
import pendingIcon from '../../public/images/pendingYellow.svg'
import React from 'react'
import { formatDate } from '@beckn-ui/common'
import { getCountryCode } from '@utils/general'
import { currencyMap } from '@lib/config'

export type OrderItem = {
  orderId: any
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
  const formatDateTime = (timeSlot: string | undefined) => {
    if (!timeSlot) return { date: '', startTime: '', endTime: '' }

    const [start, end] = timeSlot.split(' - ')
    const [startDate, startTime] = start.split(', ')
    const [endDate, endTime] = end.split(', ')

    return {
      date: `${startDate} - ${endDate}`, // Since both dates are same
      startTime,
      endTime
    }
  }
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
            <Flex
              mb={3}
              mt={3}
              alignItems="center"
            >
              <Typography
                text="Order ID:"
                fontSize="12px"
                fontWeight="600"
              />
              <Typography
                text={` ${item.orderId}`}
                fontSize="12px"
                sx={{ ml: 1 }}
              />
            </Flex>

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
                text="Date:"
                fontSize="12px"
                fontWeight="600"
              />
              <Typography
                text={` ${formatDateTime(item.timeSlot).date}`}
                fontSize="12px"
                sx={{ ml: 1 }}
              />
            </Flex>

            <Flex justifyContent={'space-between'}>
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
                  text={` ${formatDateTime(item.timeSlot).startTime} - ${formatDateTime(item.timeSlot).endTime}`}
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
                text={`${currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}${Number(item.price).toFixed(2)}`}
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
      const fulfillmentStart = order.fulfillments?.find(f => f.type === 'RENTAL_START' && f.state)
      const fulfillmentEnd = order.fulfillments?.find(f => f.type === 'RENTAL_END' && f.state)

      let startTimestamp = fulfillmentStart ? Number(fulfillmentStart.state?.descriptor?.short_desc || 0) : null
      let endTimestamp = fulfillmentEnd ? Number(fulfillmentEnd.state?.descriptor?.short_desc || 0) : null

      if (startTimestamp && startTimestamp > 9999999999) startTimestamp = Math.floor(startTimestamp / 1000)
      if (endTimestamp && endTimestamp > 9999999999) endTimestamp = Math.floor(endTimestamp / 1000)

      const startTime = formatDate(startTimestamp! * 1000, 'dd/MM/yy, h:mm a')
      const endTime = formatDate(endTimestamp! * 1000, 'dd/MM/yy, h:mm a')
      const calculatedDuration = startTimestamp && endTimestamp ? Math.round((endTimestamp - startTimestamp) / 3600) : 0
      const duration = calculatedDuration ? calculatedDuration + ' hr' : 'N/A'
      const paymentStatus = order.payments.some(payment => payment.status === 'PAID') ? 'PAID' : 'NON_PAID'

      return {
        orderId: order.order_id,
        batteryType: item.name,
        capacity: item.code,
        rentedFrom: order.descriptor.name,
        timeSlot: `${startTime} - ${endTime}`,
        duration,
        price: `${Number(order.quote.price.value)}`,
        status: paymentStatus
      }
    } catch (error) {
      console.error('Error mapping order data:', error)
      return {} as OrderItem
    }
  })
}
