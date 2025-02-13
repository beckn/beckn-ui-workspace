import { useState, useEffect } from 'react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import React from 'react'
import { Box, Button, Divider, Flex, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Typography } from '@beckn-ui/molecules'

export default function ConfirmRent() {
  const router = useRouter()
  const [dates, setDates] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [fromTime, setFromTime] = useState('10:00 AM')
  const [toTime, setToTime] = useState('10:00 PM')
  const [isFocusedFrom, setIsFocusedFrom] = useState(false)
  const [isFocusedTo, setIsFocusedTo] = useState(false)
  const [isSelectingFrom, setIsSelectingFrom] = useState(true)

  useEffect(() => {
    generateDates()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots()
    }
  }, [selectedDate])

  const generateDates = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()

    const dateArray = Array.from({ length: 3 }, (_, index) => {
      const date = new Date()
      date.setDate(today.getDate() + index)
      return {
        day: days[date.getDay()],
        date: date.getDate().toString(),
        fullDate: date.toISOString().split('T')[0]
      }
    })

    setDates(dateArray)
    setSelectedDate(`${dateArray[0].day} ${dateArray[0].date}`)
  }

  const generateTimeSlots = () => {
    const baseSlots = [
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
      '10:00 PM'
    ]

    const now = new Date()
    const currentHour = now.getHours()
    const currentDate = now.toISOString().split('T')[0]

    const selectedFullDate = dates.find(date => `${date.day} ${date.date}` === selectedDate)?.fullDate

    const slots = baseSlots.map(slot => {
      let slotHour = parseInt(slot.split(':')[0])
      if (slot.includes('PM') && slotHour !== 12) {
        slotHour += 12
      } else if (slot.includes('AM') && slotHour === 12) {
        slotHour = 0
      }

      const isDisabled = selectedFullDate === currentDate && slotHour <= currentHour

      return { time: slot, disabled: isDisabled }
    })

    setTimeSlots(slots)
  }

  const handleDateSelection = dateString => {
    setSelectedDate(dateString)
  }

  const getTimeValue = timeStr => {
    let hours = parseInt(timeStr.split(':')[0])
    const isPM = timeStr.includes('PM')

    if (isPM && hours !== 12) hours += 12
    if (!isPM && hours === 12) hours = 0

    return hours
  }

  const handleTimeSlotClick = time => {
    const isDisabled = timeSlots.find(slot => slot.time === time)?.disabled
    if (!isDisabled) {
      if (isSelectingFrom) {
        setFromTime(time)
        setToTime('')
        setIsSelectingFrom(false)
      } else {
        const fromValue = getTimeValue(fromTime)
        const toValue = getTimeValue(time)

        if (toValue > fromValue) {
          setToTime(time)
          setIsSelectingFrom(true)
        }
      }
    }
  }

  // Handle direct changes to the From time input
  const handleFromTimeChange = event => {
    const newTime = event.target.value
    if (timeSlots.some(slot => slot.time === newTime && !slot.disabled)) {
      setFromTime(newTime)
      setToTime('')
      setIsSelectingFrom(false)
    }
  }

  // Handle direct changes to the To time input
  const handleToTimeChange = event => {
    const newTime = event.target.value
    if (timeSlots.some(slot => slot.time === newTime)) {
      const fromValue = getTimeValue(fromTime)
      const toValue = getTimeValue(newTime)

      if (toValue > fromValue) {
        setToTime(newTime)
        setIsSelectingFrom(true)
      }
    }
  }

  return (
    <Box mt={5}>
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
                borderColor={isFocusedFrom || isSelectingFrom ? '#4398E8' : '#979797'}
                color={isFocusedFrom || isSelectingFrom ? '#4398E8' : '#000000'}
                onFocus={() => setIsFocusedFrom(true)}
                onBlur={() => setIsFocusedFrom(false)}
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
                borderColor={isFocusedTo || !isSelectingFrom ? '#4398E8' : '#979797'}
                color={isFocusedTo || !isSelectingFrom ? '#4398E8' : '#000000'}
                onFocus={() => setIsFocusedTo(true)}
                onBlur={() => setIsFocusedTo(false)}
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
              const isFromTime = time === fromTime
              const isToTime = time === toTime
              const isSelectable =
                !disabled &&
                (!fromTime || isFromTime || (isSelectingFrom ? true : getTimeValue(time) > getTimeValue(fromTime)))

              return (
                <Button
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  bg={isFromTime || isToTime ? '#4398E8' : '#FFFFFF'}
                  color={isFromTime || isToTime ? '#FFFFFF' : '#000000'}
                  borderWidth={1}
                  borderColor={isFromTime || isToTime ? '#4398E8' : '#979797'}
                  p={2}
                  borderRadius="lg"
                  fontSize="sm"
                  opacity={!isSelectable ? 0.5 : 1}
                  cursor={!isSelectable ? 'not-allowed' : 'pointer'}
                  _hover={{
                    bg: !isSelectable ? '#FFFFFF' : isFromTime || isToTime ? '#4398E8' : '#F5F5F5'
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
          children="Confirm & Proceed"
          handleClick={() => router.push('/checkout')}
        />
      </Box>
    </Box>
  )
}
