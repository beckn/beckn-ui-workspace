import React from 'react'
import DatePicker, { DatePickerProps } from 'react-datepicker'
import { Box } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'

interface CustomTimePickerProps {
  isInvalid?: boolean
}

const CustomTimePicker = (props: Partial<CustomTimePickerProps & DatePickerProps>) => {
  const { isInvalid = false, minTime, maxTime, ...rest } = props

  return (
    <Box
      as={DatePicker}
      {...rest}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15} // Adjust the interval as needed (e.g., 15 mins)
      timeCaption="Time"
      dateFormat="h:mm aa" // 12-hour format with AM/PM
      sx={{
        width: '100%',
        height: 'var(--input-height)',
        fontSize: 'var(--input-font-size)',
        paddingInline: 'var(--input-padding)',
        borderRadius: 'var(--input-border-radius)',
        minWidth: '0px',
        outline: '2px solid transparent',
        outlineOffset: '2px',
        appearance: 'none',
        transition: 'var(--chakra-transition-property-common) var(--chakra-transition-duration-normal)',
        lineHeight: 'var(--chakra-lineHeights-normal)',
        background: 'inherit',
        '--input-font-size': 'var(--chakra-fontSizes-md)',
        '--input-padding': 'var(--chakra-space-4)',
        '--input-border-radius': 'var(--chakra-radii-md)',
        '--input-height': 'var(--chakra-sizes-10)',
        border: `${isInvalid ? '2px' : '1px'} solid`,
        borderColor: isInvalid ? 'red' : 'inherit'
      }}
    />
  )
}

export default CustomTimePicker
