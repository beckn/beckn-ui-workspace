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
  key?: string | number
  name: string
  options: OptionModel[]
  selectedValue: T
  handleChange: (value: OptionModel) => void
  placeholder?: string
  buttonStyles?: any
  withColors?: boolean
  maxHeight?: string
  dataTest?: string
}

export const GenericDropdown = <T extends string | number>({
  key,
  name,
  options,
  selectedValue,
  handleChange,
  placeholder = 'Select an option',
  buttonStyles,
  withColors = false,
  maxHeight = '200px',
  dataTest
}: DropdownProps<T>) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuWidth, setMenuWidth] = useState<string | null>(null)

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(`${menuButtonRef.current.offsetWidth}px`)
    }
  }, [menuButtonRef.current])

  const getSelectedLabel = () => {
    const selectedOption = options?.find(option => option.value === selectedValue)
    return selectedOption ? selectedOption.label : _.startCase(placeholder)
  }

  return (
    <Menu key={key}>
      <MenuButton
        as={Button}
        rightIcon={
          <ChevronDownIcon
            width={'1.3rem'}
            height={'1.3rem'}
          />
        }
        sx={{
          width: '100%',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '14px',
          borderRadius: 'unset',
          padding: '0 16px',
          paddingLeft: 'unset',
          backgroundColor: '#fff',
          transition: 'all 0.3s ease-in-out',
          marginBottom: '0px',
          _hover: { backgroundColor: '#ffffff' },
          _active: { backgroundColor: '#ffffff' },
          textAlign: 'left',
          ...buttonStyles
        }}
        name={name}
        ref={menuButtonRef}
        data-test={dataTest}
      >
        {getSelectedLabel()}
      </MenuButton>
      <MenuList
        minWidth={menuWidth || 'auto'}
        maxHeight={maxHeight} // Add max height
        overflowY="auto"
        data-test={`${dataTest}-menu-list`}
      >
        {options?.map((option: OptionModel, index) => (
          <MenuItem
            key={index}
            onClick={() => handleChange(option)}
            style={withColors && option.color ? { color: option.color } : {}}
            data-test={`menu-item-${index}`}
            fontSize={'14px'}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
