import { InputGroup, Input, InputRightElement, Box, Icon, FormLabel } from '@chakra-ui/react'
import { FiCalendar } from 'react-icons/fi'
import React from 'react'

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
      <FormLabel
        mb="8px"
        display="block"
        position="absolute"
        zIndex={1}
        top="11px"
        pointerEvents="none"
        color="#333"
        transition="0.2s ease all"
        sx={{
          '&.floating': {
            top: '-8px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#000000'
          }
        }}
        className={startDate || endDate ? 'floating' : ''}
      >
        Select a Date
      </FormLabel>
      <InputGroup>
        <Input
          value={`${startDate || ''} - ${endDate || ''}`}
          placeholder="Start Date - End Date"
          readOnly
          sx={{
            fontSize: '15px',
            display: 'block',
            padding: '15px 0 0 0',
            width: '100%',
            height: '36px',
            background: '#fff',
            border: 'none',
            borderBottom: '1px solid #BFBFBF',
            boxSizing: 'border-box',
            borderRadius: 'none',
            _focus: {
              outline: 'none',
              borderBottom: '1px solid #4498E8'
            }
          }}
        />
        <InputRightElement
          cursor="pointer"
          onClick={onCalendarClick}
          height="36px"
          mt={'5px'}
        >
          <Icon
            as={FiCalendar}
            boxSize="20px"
            color="#4498E8"
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  )
}

export default CustomeDateInput
