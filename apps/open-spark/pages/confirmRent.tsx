import { useState, useEffect } from 'react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import type React from 'react'
import { Box, Button, Divider, Flex, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Typography } from '@beckn-ui/molecules'
import { feedbackActions, type ICartRootState } from '@beckn-ui/common'
import { useDispatch, useSelector } from 'react-redux'
import { DOMAIN_PATH } from '@lib/config'
import {
  generateDates,
  generateTimeSlots,
  getTimeValue,
  convertToTimestamp,
  prepareApiPayload
} from '../utilities/confirmRent-utils'
import type { DateInfo, TimeSlot, CartItem } from '../lib/types/rentalTypes'
import { setOrderData } from '@store/rental-slice'

export default function ConfirmRent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const dispatch = useDispatch()
  const [dates, setDates] = useState<DateInfo[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [fromTime, setFromTime] = useState<string>('')
  const [toTime, setToTime] = useState<string>('')
  const [isSelectingFrom, setIsSelectingFrom] = useState<boolean>(true)
  const [activeField, setActiveField] = useState<'from' | 'to'>('from')
  const cartItems = useSelector((state: ICartRootState) => state.cart.items) as CartItem[]

  useEffect(() => {
    const generatedDates = generateDates()
    setDates(generatedDates)
    setSelectedDate(`${generatedDates[0].day} ${generatedDates[0].date}`)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate, dates))
    }
  }, [selectedDate, dates])

  const handleDateSelection = (dateString: string) => {
    setSelectedDate(dateString)
  }

  const handleTimeSlotClick = (time: string) => {
    const isDisabled = timeSlots.find(slot => slot.time === time)?.disabled

    if (!isDisabled) {
      if (activeField === 'from') {
        setFromTime(time)
        setToTime('') // Reset "To" when changing "From"
      } else {
        const fromValue = getTimeValue(fromTime)
        const toValue = getTimeValue(time)

        if (toValue > fromValue) {
          setToTime(time)
        }
      }
    }
  }

  // Handle direct changes to the From time input
  const handleFromTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value
    if (timeSlots.some(slot => slot.time === newTime && !slot.disabled)) {
      setFromTime(newTime)
      setToTime('')
      setIsSelectingFrom(false)
    }
  }

  // Handle direct changes to the To time input
  const handleToTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value
    const fromValue = getTimeValue(fromTime)
    const toValue = getTimeValue(newTime)

    if (timeSlots.some(slot => slot.time === newTime) && toValue > fromValue) {
      setToTime(newTime)
      setIsSelectingFrom(true) // Ensure we do not modify "From" again
    }
  }

  const handleConfirm = async () => {
    if (!cartItems.length) return
    console.log('selectedDate', selectedDate)
    console.log('fromTime', fromTime, toTime)

    localStorage.setItem('fromTime', fromTime)
    localStorage.setItem('toTime', toTime)

    const fromTimestamp = convertToTimestamp(selectedDate, fromTime)
    const toTimestamp = convertToTimestamp(selectedDate, toTime)

    if (!fromTimestamp || !toTimestamp) return

    const domain = DOMAIN_PATH.RENT_AND_HIRE
    const payload = prepareApiPayload(cartItems, fromTimestamp, toTimestamp, domain)

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

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)

  useEffect(() => {
    const fromValue = getTimeValue(fromTime)
    const toValue = getTimeValue(toTime)

    if (fromTime && toTime && toValue > fromValue) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [fromTime, toTime])

  return (
    <Box
      mt={5}
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <Box>
        <Box mb={'40px'}>
          <Typography
            text="Select Date:"
            fontSize="17px"
            fontWeight="400"
            sx={{ mb: '10px' }}
          />

          <Flex
            gap={2}
            justifyContent="start"
          >
            {dates.map(({ day, date }) => {
              const dateString = `${day} ${date}`
              return (
                <Button
                  key={dateString}
                  onClick={() => handleDateSelection(dateString)}
                  bg={selectedDate === dateString ? '#4398E8' : '#FFFFFF'}
                  color={selectedDate === dateString ? '#FFFFFF' : '#000000'}
                  borderWidth={1}
                  width="60px"
                  height="70px"
                  p={4}
                  borderRadius="lg"
                >
                  <Box textAlign="center">
                    <Text color={selectedDate === dateString ? '#FFFFFF' : '#000000'}>{day}</Text>
                    <Text color={selectedDate === dateString ? '#FFFFFF' : '#000000'}>{date}</Text>
                  </Box>
                </Button>
              )
            })}
          </Flex>
        </Box>

        <Box mb={'40px'}>
          <Typography
            text="Select Time slot:"
            fontSize="17px"
            fontWeight="400"
            sx={{ mb: '20px' }}
          />
          <HStack
            spacing={4}
            align="flex-end"
          >
            <VStack
              align="flex-start"
              spacing={1}
            >
              <Typography
                text="From"
                fontSize="15px"
                fontWeight="400"
              />
              <Input
                value={fromTime}
                width="110px"
                borderColor={activeField === 'from' ? '#4398E8' : '#979797'}
                color={activeField === 'from' ? '#4398E8' : '#000000'}
                onFocus={() => setActiveField('from')} // Track "From" selection
                onChange={handleFromTimeChange}
                readOnly
              />
            </VStack>

            <Typography
              text="-"
              fontSize="15px"
              fontWeight="400"
              sx={{ mb: 2 }}
            />

            <VStack
              align="flex-start"
              spacing={1}
            >
              <Typography
                text="To"
                fontSize="15px"
                fontWeight="400"
              />
              <Input
                value={toTime}
                width="110px"
                borderColor={activeField === 'to' ? '#4398E8' : '#979797'}
                color={activeField === 'to' ? '#4398E8' : '#000000'}
                onFocus={() => setActiveField('to')} // Track "To" selection
                onChange={handleToTimeChange}
                readOnly
              />
            </VStack>
          </HStack>

          <Divider
            mb={5}
            mt={5}
          />

          <Grid
            templateColumns="repeat(4, 1fr)"
            gap={2}
          >
            {timeSlots.map(({ time, disabled }) => {
              const timeValue = getTimeValue(time)
              const fromValue = getTimeValue(fromTime)
              const toValue = getTimeValue(toTime)

              const isFromTime = timeValue === fromValue
              const isToTime = timeValue === toValue
              const isInRange = fromValue && toValue && timeValue >= fromValue && timeValue <= toValue
              const isSelectable =
                !disabled && (!fromTime || isFromTime || (isSelectingFrom ? true : timeValue > fromValue))

              return (
                <Button
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  bg={isFromTime || isToTime || isInRange ? '#4398E8' : '#FFFFFF'}
                  color={isFromTime || isToTime || isInRange ? '#FFFFFF' : '#000000'}
                  borderWidth={1}
                  borderColor={isFromTime || isToTime || isInRange ? '#4398E8' : '#979797'}
                  p={2}
                  borderRadius="lg"
                  fontSize="sm"
                  opacity={!isSelectable ? 0.5 : 1}
                  cursor={!isSelectable ? 'not-allowed' : 'pointer'}
                  _hover={{
                    bg: !isSelectable ? '#FFFFFF' : isFromTime || isToTime || isInRange ? '#4398E8' : '#F5F5F5'
                  }}
                  disabled={!isSelectable}
                >
                  {time}
                </Button>
              )
            })}
          </Grid>
        </Box>
        <BecknButton
          disabled={isButtonDisabled}
          children="Confirm & Proceed"
          handleClick={handleConfirm}
        />
      </Box>
    </Box>
  )
}
