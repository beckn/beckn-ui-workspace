import { Menu, MenuButton, MenuList, MenuItem, Button, useTheme } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Styles from './dropdown.module.css'

export interface OptionModel {
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
  buttonStyles?: Record<string, unknown>
  withColors?: boolean
  maxHeight?: string
  dataTest?: string
  disabled?: boolean
  variant?: 'default' | 'clean'
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
  maxHeight = '140px',
  dataTest,
  disabled = false,
  variant = 'default'
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
    return selectedValue ? selectedValue.label : ''
  }

  const getPlaceholderText = () => {
    if (variant === 'clean') return null

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
    if (variant === 'clean') {
      return selectedValueText || placeholder
    }
    return selectedValueText === '' ? getPlaceholderText() : selectedValueText
  }

  const getButtonStyles = () => {
    const baseStyles = {
      width: '100%',
      fontSize: '16px',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease-in-out',
      marginBottom: '0px',
      _hover: { backgroundColor: '#ffffff' },
      _active: { backgroundColor: '#ffffff' },
      textAlign: 'left' as const,
      ...buttonStyles
    }

    if (variant === 'clean') {
      return {
        ...baseStyles,
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '8px 16px',
        height: 'auto',
        color: selectedOption() ? 'inherit' : '#868686'
      }
    }

    return {
      ...baseStyles,
      borderBottom: '1px solid #e2e8f0',
      borderRadius: 'unset',
      padding: '0 16px',
      paddingLeft: 'unset',
      _active: { ...baseStyles._active, borderColor: primaryColor }
    }
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
        disabled={disabled}
        sx={getButtonStyles()}
        name={name}
        ref={menuButtonRef}
        data-test={dataTest}
      >
        {getPlaceholderText()}
        {renderValueText()}
      </MenuButton>
      <MenuList
        minWidth={menuWidth || 'auto'}
        maxHeight={maxHeight}
        overflowY="auto"
        data-test={`${dataTest}-menu-list`}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        {options?.map((option: OptionModel, index) => (
          <MenuItem
            key={index}
            onClick={() => handleChange({ ...option, name })}
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
