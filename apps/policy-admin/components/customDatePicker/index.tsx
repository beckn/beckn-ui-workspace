import React from 'react'
import DatePicker, { DatePickerProps } from 'react-datepicker'
import { Box } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'

interface CustomDatePickerProps {
  isInvalid: boolean
}

const CustomDatePicker = (props: Partial<CustomDatePickerProps | DatePickerProps>) => {
  const { isInvalid = false, ...rest } = props
  return (
    <Box
      as={DatePicker}
      {...props}
      sx={{
        '-webkit-padding-end': 'var(--chakra-space-8)',
        'padding-inline-end': 'var(--chakra-space-8)',
        width: '100%',
        height: 'var(--input-height)',
        fontSize: 'var(--input-font-size)',
        '-webkit-padding-start': 'var(--input-padding)',
        'padding-inline-start': 'var(--input-padding)',
        borderRadius: 'var(--input-border-radius)',
        minWidth: '0px',
        outline: '2px solid transparent',
        outlineOffset: '2px',
        position: 'relative',
        '-webkit-appearance': 'none',
        '-moz-appearance': 'none',
        '-ms-appearance': 'none',
        appearance: 'none',
        transitionProperty: 'var(--chakra-transition-property-common)',
        transitionDuration: 'var(--chakra-transition-duration-normal)',
        paddingBottom: '1px',
        lineHeight: 'var(--chakra-lineHeights-normal)',
        background: 'inherit',
        '--select-bg': 'var(--chakra-colors-white)',
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

export default CustomDatePicker
