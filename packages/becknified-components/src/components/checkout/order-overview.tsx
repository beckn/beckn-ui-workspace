import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Divider } from '@chakra-ui/react'
import React from 'react'

export interface RentalItemProps {
  batteryType?: string
  capacity?: string
  rentedFrom?: string
  timeSlot?: string
  duration?: string
}

const OrderOverview: React.FC<{ items: RentalItemProps[] }> = ({ items }) => {
  const formatDateTime = (timeSlot: string | undefined) => {
    if (!timeSlot) return { date: '', startTime: '', endTime: '' }

    const [start, end] = timeSlot.split(' - ')
    const [startDate, startTime] = start.split(', ')
    const [endDate, endTime] = end.split(', ')

    return {
      date: startDate, // Since both dates are same
      startTime,
      endTime
    }
  }

  if (!items.length) return null

  return (
    <Box>
      {items.map((item, index) => (
        <React.Fragment key={index}>
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
          {index < items.length - 1 && (
            <Divider
              my={4}
              borderColor="gray.200"
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  )
}

export default OrderOverview
