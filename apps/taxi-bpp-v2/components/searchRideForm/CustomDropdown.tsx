import React from 'react'
import { Button, Menu, MenuButton, MenuItem, MenuList, useTheme } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

import { CustomDropDownProps } from './SearchRideForm.types'

const CustomDropdown: React.FC<CustomDropDownProps> = ({ items, value, onChange }) => {
  const theme = useTheme()

  return (
    <Menu>
      <MenuButton
        w={'100%'}
        h={'36px'}
        p={'0px'}
        mb="unset"
        background={'#ffffff'}
        borderRadius={'4px'}
        border={'1px'}
        borderColor={'#E6E6E6'}
        textColor={theme.colors.primary[100]}
        fontSize={'12px'}
        fontWeight={500}
        iconSpacing={'200px'}
        as={Button}
        rightIcon={
          <ChevronDownIcon
            w={'30px'}
            h={'20px'}
          />
        }
      >
        {items.find(item => item.value === value)?.label}
      </MenuButton>
      <MenuList position={'absolute'}>
        {items.map(item => {
          return (
            <MenuItem
              onClick={() => onChange(item.value, item.tag)}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  )
}

export default CustomDropdown
