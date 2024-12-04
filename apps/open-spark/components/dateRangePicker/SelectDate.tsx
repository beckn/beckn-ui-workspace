import React, { useState } from 'react'
import { Box, Flex, Text, VStack, Grid, GridItem } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isAfter,
  isBefore,
  parse,
  subDays
} from 'date-fns'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import BottomModal from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'

interface SelectDateProps {
  isOpen: boolean
  onClose: () => void
  onDateSelect: (startDate: string, endDate: string) => void
  initialStartDate: string
  initialEndDate: string
}

const customDateOptions = [
  'Today',
  'Yesterday',
  'This week',
  'Last week',
  'This month',
  'Last month',
  'This year',
  'Last year',
  'Custom Range'
]

const SelectDate: React.FC<SelectDateProps> = ({ isOpen, onClose, onDateSelect, initialStartDate, initialEndDate }) => {
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date | null>(parse(initialStartDate, 'dd/MM/yy', new Date()))
  const [endDate, setEndDate] = useState<Date | null>(parse(initialEndDate, 'dd/MM/yy', new Date()))

  const handleQuickSelect = (option: string) => {
    const today = new Date()
    let newStartDate: Date
    let newEndDate: Date

    switch (option) {
      case 'Today':
        newStartDate = today
        newEndDate = today
        break
      case 'Yesterday':
        newStartDate = subDays(today, 1)
        newEndDate = subDays(today, 1)
        break
      case 'This week':
        newStartDate = startOfWeek(today)
        newEndDate = endOfWeek(today)
        break
      case 'Last week':
        newStartDate = startOfWeek(subDays(today, 7))
        newEndDate = endOfWeek(subDays(today, 7))
        break
      case 'This month':
        newStartDate = startOfMonth(today)
        newEndDate = endOfMonth(today)
        break
      case 'Last month':
        newStartDate = startOfMonth(subMonths(today, 1))
        newEndDate = endOfMonth(subMonths(today, 1))
        break
      case 'This year':
        newStartDate = new Date(today.getFullYear(), 0, 1)
        newEndDate = new Date(today.getFullYear(), 11, 31)
        break
      case 'Last year':
        newStartDate = new Date(today.getFullYear() - 1, 0, 1)
        newEndDate = new Date(today.getFullYear() - 1, 11, 31)
        break
      case 'Custom Range':
        setIsCustomRange(true)
        return
      default:
        return
    }

    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day)
      setEndDate(null)
    } else {
      if (isBefore(day, startDate)) {
        setEndDate(startDate)
        setStartDate(day)
      } else {
        setEndDate(day)
      }
    }
  }

  const isInRange = (day: Date) => {
    return startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate)
  }

  const renderCalendar = () => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    })

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

    return (
      <Box>
        <Flex
          justify="space-between"
          align="center"
          mb={4}
        >
          <ChevronLeftIcon
            boxSize={6}
            cursor="pointer"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          />
          <Text
            fontSize={'16px'}
            fontWeight="600"
            mb={'10px'}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <ChevronRightIcon
            boxSize={6}
            cursor="pointer"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          />
        </Flex>
        <Grid
          templateColumns="repeat(7, 1fr)"
          gap={1}
        >
          {daysOfWeek.map(day => (
            <GridItem
              key={day}
              textAlign="center"
              fontWeight="semibold"
            >
              {day}
            </GridItem>
          ))}
          {daysInMonth.map((day, index) => (
            <GridItem
              key={index}
              textAlign="center"
              py={2}
              bg={
                (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))
                  ? 'blue.500'
                  : isInRange(day)
                    ? 'blue.100'
                    : 'transparent'
              }
              color={
                (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate)) ? 'white' : 'inherit'
              }
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'blue.100' }}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </GridItem>
          ))}
        </Grid>
      </Box>
    )
  }

  const handleSave = () => {
    if (startDate && endDate) {
      onDateSelect(format(startDate, 'dd/MM/yy'), format(endDate, 'dd/MM/yy'))
    }
    onClose()
  }

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader={isCustomRange ? 'Custom Range' : 'Select a Date'}
    >
      {!isCustomRange ? (
        <VStack align="stretch">
          {customDateOptions.map(option => (
            <Text
              key={option}
              justifyContent="flex-start"
              fontWeight={500}
              fontSize={'15px'}
              paddingLeft={'40px'}
              onClick={() => handleQuickSelect(option)}
              _hover={{ bg: 'gray.100' }}
              m={'5px'}
            >
              {option}
            </Text>
          ))}
        </VStack>
      ) : (
        <Box>
          <Flex
            justify="space-between"
            m={4}
          >
            <Box
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              width="45%"
            >
              {startDate ? format(startDate, 'MMM d, yyyy') : 'Start Date'}
            </Box>
            <Text alignSelf="center">-</Text>
            <Box
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              width="45%"
            >
              {endDate ? format(endDate, 'MMM d, yyyy') : 'End Date'}
            </Box>
          </Flex>
          {renderCalendar()}
        </Box>
      )}
      <Box padding={'20px 20px 0px 20px'}>
        {isCustomRange && (
          <BecknButton
            children="Back"
            handleClick={() => setIsCustomRange(false)}
            variant="outline"
          />
        )}
        <BecknButton
          children={isCustomRange ? 'Apply' : 'Save'}
          handleClick={handleSave}
          variant="solid"
        />
      </Box>
    </BottomModal>
  )
}

export default SelectDate
