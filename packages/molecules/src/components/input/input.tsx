import React, { useState } from 'react'
import { InputProps } from './input.types'
import { Input as ChakraInput, IconButton, useTheme, Box } from '@chakra-ui/react'
import Styles from './input.module.css'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Input: React.FC<InputProps> = ({
  variant = 'flushed',
  type,
  value,
  name,
  placeholder = '',
  handleChange,
  label,
  className,
  error,
  disabled,
  dataTest,
  readOnly = false,
  rightElement,
  customInputBlurHandler
}) => {
  const theme = useTheme()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const isPassword = type === 'password'
  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
  }

  return (
    <div className={Styles.input_container}>
      <ChakraInput
        data-testid="test-chakra-input"
        data-test={dataTest}
        onFocus={handleInputFocus}
        onBlur={event => {
          handleInputBlur()
          customInputBlurHandler?.(event)
        }}
        _focus={{ borderColor: theme.colors.primary[100], outline: 'none' }}
        _focusVisible={{ boxShadow: 'unset' }}
        className={Styles.input}
        variant={variant}
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
      />
      {isPassword && (
        <IconButton
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
          onClick={togglePasswordVisibility}
          variant="ghost"
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          _hover="none"
        />
      )}
      {rightElement && (
        <Box
          position="absolute"
          right="10px"
          top="75%"
          transform="translateY(-50%)"
        >
          {rightElement?.()}
        </Box>
      )}

      {label && (
        <label
          style={{ color: isInputFocused ? theme.colors.primary[100] : theme.colors.textPrimary }}
          className={Styles.input_label}
        >
          {label}
        </label>
      )}
      {error && <div className={Styles.error}>{error}</div>}
    </div>
  )
}

export default Input
