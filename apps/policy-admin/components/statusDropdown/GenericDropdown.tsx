import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'

interface OptionModel {
  value: string
  label: string
  color?: string
}

interface DropdownProps<T> {
  options: OptionModel[]
  selectedValue: T
  setSelectedValue: (value: T) => void
  placeholder?: string
  buttonStyles?: any
  withColors?: boolean
  maxHeight?: string
}

export const GenericDropdown = <T extends string | number>({
  options,
  selectedValue,
  setSelectedValue,
  placeholder = 'Select an option',
  buttonStyles,
  withColors = false,
  maxHeight = '200px'
}: DropdownProps<T>) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuWidth, setMenuWidth] = useState<string | null>(null)

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(`${menuButtonRef.current.offsetWidth}px`)
    }
  }, [menuButtonRef.current])

  const handleSelect = (value: T) => {
    setSelectedValue(value)
  }

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === selectedValue)
    return selectedOption ? selectedOption.label : _.startCase(placeholder)
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={
          <ChevronDownIcon
            width={'1.3rem'}
            height={'1.3rem'}
          />
        }
        background="#ffffff"
        sx={{
          width: '100%',
          border: '1px solid #e2e8f0',
          fontSize: '16px',
          borderRadius: 'md',
          padding: '0 16px',
          transition: 'all 0.3s ease-in-out',
          marginBottom: '0px',
          _hover: { backgroundColor: '#ffffff' },
          _active: { backgroundColor: '#ffffff' },
          textAlign: 'left',
          ...buttonStyles
        }}
        ref={menuButtonRef}
      >
        {getSelectedLabel()}
      </MenuButton>
      <MenuList
        minWidth={menuWidth || 'auto'}
        maxHeight={maxHeight} // Add max height
        overflowY="auto"
      >
        {options.map((option: OptionModel, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSelect(option.value as T)}
            style={withColors && option.color ? { color: option.color } : {}}
            fontSize={'14px'}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
