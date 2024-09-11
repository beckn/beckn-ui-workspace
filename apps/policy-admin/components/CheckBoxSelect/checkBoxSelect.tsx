import React, { useCallback, useState } from 'react'
import { Box, Checkbox, Input, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

export interface MultiSelectDropdownProps {
  options: {
    label: string
    value: string
  }[]
  isInvalid?: boolean
  selectedOptions: string[]
  setSelectedOptions: (value: string[]) => void
}

const MultiSelectDropdown = (props: MultiSelectDropdownProps) => {
  const { options, selectedOptions, setSelectedOptions, isInvalid } = props

  // Handle checkbox change
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setSelectedOptions(
        selectedOptions.includes(value)
          ? selectedOptions.filter(option => option !== value)
          : [...selectedOptions, value]
      )
    },
    [selectedOptions]
  )

  return (
    <Box width="45.2%">
      <Menu closeOnSelect={false}>
        {/* Input field styled as a button */}
        <MenuButton
          as={Button}
          rightIcon={
            <ChevronDownIcon
              width={'20px'}
              height="32px"
            />
          }
          marginBottom="0px"
          width="100%"
          height="40px"
          padding="0 8px 0 0"
          borderWidth="1px"
          borderRadius="md"
          border={`${isInvalid ? '2px' : '1px'} solid`}
          borderColor={isInvalid ? 'red' : 'inherit'}
          background="#fff"
          _hover={{ backgroundColor: 'trasparent' }}
          _active={{ backgroundColor: 'trasparent' }}
        >
          <Input
            placeholder="Select"
            value={(selectedOptions && selectedOptions.join(', ')) || ''}
            isReadOnly
            border="none"
            pointerEvents="none"
          />
        </MenuButton>

        {/* Dropdown list with checkboxes */}
        <MenuList>
          {options.map((option, index) => (
            <MenuItem key={index}>
              <Checkbox
                value={option.value}
                isChecked={selectedOptions.includes(option.value)}
                onChange={handleChange}
              >
                {option.label}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  )
}

export default MultiSelectDropdown
