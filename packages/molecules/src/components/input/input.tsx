import React, { useState } from 'react'
import { InputProps } from './input.types'
import { Input as ChakraInput, useTheme } from '@chakra-ui/react'
import Styles from './input.module.css'

const Input: React.FC<InputProps> = ({
  variant = 'flushed',
  type,
  value,
  name,
  placeholder = '',
  handleChange,
  label,
  className,
  error
}) => {
  const theme = useTheme()
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
  }

  return (
    <div className={Styles.input_container}>
      <ChakraInput
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        _focus={{ borderColor: theme.colors.primary[100], outline: 'none' }}
        _focusVisible={{ boxShadow: 'unset' }}
        className={Styles.input}
        variant={variant}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
      />
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
