import { Box, Icon } from '@chakra-ui/react'
import { FiCalendar } from 'react-icons/fi'
import React from 'react'
import { Input } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

interface CustomeDateInputProps {
  startDate: string
  endDate: string
  onCalendarClick: () => void
}

const CustomeDateInput = (props: CustomeDateInputProps) => {
  const { startDate, endDate, onCalendarClick } = props
  return (
    <Box
      width="300px"
      position="relative"
      mt={'2 px'}
    >
      <Input
        dataTest={testIds.custom_date_input}
        value={`${startDate || ''} - ${endDate || ''}`}
        label="Select a Date"
        readOnly={true}
        handleChange={() => {}}
        name={'date'}
        type="text"
        rightElement={() => {
          return (
            <Box
              cursor="pointer"
              onClick={onCalendarClick}
              height="36px"
              mt={'8px'}
            >
              <Icon
                data-test={testIds.custom_date_icon}
                as={FiCalendar}
                boxSize="20px"
                color="#4498E8"
              />
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default CustomeDateInput
