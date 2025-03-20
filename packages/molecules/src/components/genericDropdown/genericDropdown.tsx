import { Menu, MenuButton, MenuList, MenuItem, Button, FormLabel, Box, useTheme } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import Styles from './dropdown.module.css'

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
  placeholder = '',
  buttonStyles,
  withColors = false,
  maxHeight = '200px',
  dataTest
}: DropdownProps<T>) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuWidth, setMenuWidth] = useState<string | null>(null)
  const [active, setActive] = useState(false)

  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(`${menuButtonRef.current.offsetWidth}px`)
    }
  }, [menuButtonRef.current])

  const selectedOption = useCallback(() => options?.find(option => option.value === selectedValue), [selectedValue])

  const getSelectedLabel = () => {
    const selectedValue = selectedOption()
    return selectedValue ? selectedValue.label : '' // _.startCase(placeholder)
  }

  const getPlaceholderText = () => {
    return (
      <>
        {!placeholder ? (
          <></>
        ) : (
          <label
            className={Styles.input_label}
            style={{ color: active ? primaryColor : 'inherit', top: active || selectedOption() ? '-11px' : '11px' }}
          >
            {placeholder}
          </label>
        )}
      </>
    )
  }

  const renderValueText = () => {
    const selectedValueText = getSelectedLabel()
    return selectedValueText === '' ? getPlaceholderText() : selectedValueText
  }

  return (
    <Menu key={key}>
      <MenuButton
        position={'relative'}
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
          fontSize: '16px',
          borderRadius: 'unset',
          padding: '0 16px',
          paddingLeft: 'unset',
          backgroundColor: '#fff',
          transition: 'all 0.3s ease-in-out',
          marginBottom: '0px',
          _hover: { backgroundColor: '#ffffff' },
          _active: { backgroundColor: '#ffffff', borderColor: primaryColor },
          textAlign: 'left',
          // color: selectedOption() ? '' : '#868686',
          ...buttonStyles
        }}
        name={name}
        ref={menuButtonRef}
        data-test={dataTest}
      >
        {getPlaceholderText()}
        {renderValueText()}
      </MenuButton>
      <MenuList
        minWidth={menuWidth || 'auto'}
        maxHeight={maxHeight} // Add max height
        overflowY="auto"
        data-test={`${dataTest}-menu-list`}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        {options?.map((option: OptionModel, index) => (
          <MenuItem
            key={index}
            onClick={() => handleChange({ ...option, name } as any)}
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
