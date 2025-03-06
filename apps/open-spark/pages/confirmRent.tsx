import { useState } from 'react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import type React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { DiscoveryRootState, feedbackActions, formatDate, ParsedItemModel, type ICartRootState } from '@beckn-ui/common'
import { useDispatch, useSelector } from 'react-redux'
import { DOMAIN_PATH } from '@lib/config'
import { prepareApiPayload } from '../utilities/confirmRent-utils'
import type { CartItem } from '../lib/types/rentalTypes'
import { setOrderData } from '@store/rental-slice'
import CustomTimePicker from '@components/dateTimePicker/customTimePicker'
import CustomDatePicker from '@components/dateTimePicker/customDatePicker'

export default function ConfirmRent() {
  // const [fromTime, setFromTime] = useState<Date>(new Date())
  // const [toTime, setToTime] = useState<Date>(new Date())
  const [date, setDate] = useState<string>(new Date().toISOString())
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items) as CartItem[]
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const rentalDate = selectedProduct.item.fulfillments[0].state?.name

  const handleConfirm = async () => {
    const formTimestamp = Math.floor(new Date(fromTime).getTime() / 1000)
    const toTimestamp = Math.floor(new Date(toTime).getTime() / 1000)
    localStorage.setItem('fromTimestamp', formTimestamp.toString())
    localStorage.setItem('toTimestamp', toTimestamp.toString())
    const domain = DOMAIN_PATH.RENT_AND_HIRE
    const payload = prepareApiPayload(cartItems, formTimestamp, toTimestamp, domain)

    try {
      const response = await fetch(`${apiUrl}/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('API Response:', responseData?.data[0]?.message)
        if (!responseData?.data[0]?.message.order.items) {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Time slot Unavailable',
                display: true,
                type: 'error',
                description: 'Please select a different time.'
              }
            })
          )
        } else {
          dispatch(setOrderData(responseData?.data[0]))
          router.push('/checkout')
        }
      } else {
        console.error('API Error:', response.statusText)
      }
    } catch (error) {
      console.error('Network Error:', error)
    }
  }

  const roundToNextHour = (date: Date) => {
    const roundedDate = new Date(date)
    // If minutes are not 0, round up to next hour
    if (roundedDate.getMinutes() > 0) {
      roundedDate.setHours(roundedDate.getHours() + 1)
    }
    roundedDate.setMinutes(0)
    roundedDate.setSeconds(0)
    roundedDate.setMilliseconds(0)
    return roundedDate
  }

  // Initialize with rounded current time
  const [fromTime, setFromTime] = useState<Date>(roundToNextHour(new Date()))
  const [toTime, setToTime] = useState<Date>(() => {
    const initialEndTime = roundToNextHour(new Date())
    initialEndTime.setHours(initialEndTime.getHours() + 1)
    return initialEndTime
  })

  // Update the time change handlers
  const handleFromTimeChange = (date: Date) => {
    const roundedTime = roundToNextHour(date)
    setFromTime(roundedTime)
  }

  const handleToTimeChange = (date: Date) => {
    const roundedTime = roundToNextHour(date)
    setToTime(roundedTime)
  }

  // Add this helper function at the top of the component
  const isToday = (dateToCheck: Date) => {
    const today = new Date()
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    )
  }

  // Add this helper function to check if a time is in the past
  const isTimePast = (timeToCheck: Date) => {
    const now = new Date()
    return timeToCheck.getTime() < now.getTime()
  }

  return (
    <Box
      mt={5}
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
      mb={5}
    >
      <Box mb={9}>
        <Text
          mb={3}
          fontSize="16px"
        >
          Select Date
        </Text>
        <Flex align="center">
          <CustomDatePicker
            selected={new Date(date)}
            placeholderText="Select 'from' date"
            onChange={(date: any) => {
              setDate(date?.toISOString())
              setFromTime(roundToNextHour(new Date(date)))
              setToTime(roundToNextHour(new Date(date)))
            }}
            dateFormat="dd-MM-yyyy"
            isInvalid={false}
          />
        </Flex>
      </Box>

      <Box mb={6}>
        <Text
          mb={3}
          fontSize="16px"
        >
          Select Time
        </Text>
        <Flex
          align="center"
          flexDir={'column'}
        >
          <Flex align="center">
            <CustomTimePicker
              selected={fromTime}
              placeholderText="Select 'from'"
              onChange={handleFromTimeChange}
              dateFormat="h:mm aa"
              isInvalid={false}
              minTime={isToday(new Date(date)) ? new Date() : undefined}
            />
            <Text mx={3}>-</Text>
            <CustomTimePicker
              selected={toTime}
              placeholderText="Select 'to'"
              onChange={handleToTimeChange}
              dateFormat="h:mm aa"
              isInvalid={false}
              minTime={
                isToday(new Date(date)) ? (fromTime.getTime() > new Date().getTime() ? fromTime : new Date()) : fromTime
              }
            />
          </Flex>
        </Flex>
      </Box>
      <Box mt={'250px'}>
        <BecknButton
          text="Confirm & Proceed"
          handleClick={handleConfirm}
          disabled={
            fromTime.getTime() === toTime.getTime() ||
            (isToday(new Date(date)) && (isTimePast(fromTime) || isTimePast(toTime))) ||
            toTime.getTime() < fromTime.getTime()
          }
        />
      </Box>
    </Box>
  )
}
