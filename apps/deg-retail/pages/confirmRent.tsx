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
import { roundToNextHour } from '@utils/general'

export default function ConfirmRent() {
  // const [fromTime, setFromTime] = useState<Date>(new Date())
  // const [toTime, setToTime] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<string>(roundToNextHour(new Date()).toISOString())
  const [endDate, setEndDate] = useState<string>(
    roundToNextHour(new Date(new Date(startDate).setHours(new Date(startDate).getHours() + 1))).toISOString()
  )
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items) as CartItem[]
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const rentalDate = selectedProduct.item.fulfillments[0].state?.name

  const handleConfirm = async () => {
    const formTimestamp = new Date(startDate).getTime()
    const toTimestamp = new Date(endDate).getTime()
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

  const getMinTimeForStartDate = () => {
    const now = new Date()
    const selectedDate = new Date(startDate)
    const isToday = now.toDateString() === selectedDate.toDateString()

    return isToday ? now : new Date(selectedDate.setHours(0, 0, 0, 0))
  }

  const getMinDateForEndDate = () => {
    const selectedDate = new Date(startDate)
    if (selectedDate.getHours() === 23) {
      selectedDate.setDate(selectedDate.getDate() + 1)
      selectedDate.setHours(0, 0, 0, 0)
    }
    return selectedDate
  }

  const getMinTimeForEndDate = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const isSameDay = start.toDateString() === end.toDateString()

    if (isSameDay) {
      let hours = start.getHours() + 1
      if (hours >= 24) {
        start.setDate(start.getDate() + 1)
        hours = 0
      }
      start.setHours(hours, 0, 0, 0)
      return start
    }
    end.setHours(0, 0, 0, 0)
    return end
  }

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return
    const selectedDate = new Date(date)

    const newEndDate = new Date(selectedDate)
    const selectedHours = selectedDate.getHours()
    if (selectedHours === 23) {
      newEndDate.setDate(newEndDate.getDate() + 1)
      newEndDate.setHours(0, 0, 0, 0)
    } else {
      newEndDate.setHours(selectedHours + 1, 0, 0, 0)
    }

    setStartDate(roundToNextHour(selectedDate).toISOString())
    setEndDate(roundToNextHour(newEndDate).toISOString())
    setFromTime(roundToNextHour(selectedDate))
    setToTime(roundToNextHour(selectedDate))
  }

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return
    setEndDate(roundToNextHour(new Date(date)).toISOString())
    setFromTime(roundToNextHour(new Date(date)))
    setToTime(roundToNextHour(new Date(date)))
  }

  return (
    <Box
      mt={5}
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
      mb={5}
    >
      <Box mb={6}>
        <Text
          mb={3}
          mt={3}
          fontSize="16px"
        >
          From Date
        </Text>
        <Flex align="center">
          <CustomDatePicker
            selected={new Date(startDate)}
            placeholderText="Select 'from' date"
            showTimeSelect
            minDate={new Date()}
            minTime={getMinTimeForStartDate()}
            maxTime={new Date(new Date().setHours(23, 0, 0, 0))}
            timeIntervals={60}
            onChange={handleStartDateChange}
            dateFormat="dd-MM-yyyy hh:mm a"
            isInvalid={false}
          />
        </Flex>
        <Text
          mb={3}
          mt={3}
          fontSize="16px"
        >
          To Date
        </Text>
        <Flex align="center">
          <CustomDatePicker
            selected={new Date(endDate)}
            placeholderText="Select 'to' date"
            showTimeSelect
            minDate={getMinDateForEndDate()}
            minTime={getMinTimeForEndDate()}
            maxTime={new Date(new Date(startDate).setHours(new Date(startDate).getHours() === 23 ? 47 : 23, 0, 0, 0))}
            timeIntervals={60}
            onChange={handleEndDateChange}
            dateFormat="dd-MM-yyyy hh:mm a"
            isInvalid={false}
          />
        </Flex>
      </Box>

      {/* <Box mb={6}>
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
      </Box> */}
      <Box mt={'250px'}>
        <BecknButton
          text="Confirm & Proceed"
          handleClick={handleConfirm}
        />
      </Box>
    </Box>
  )
}
