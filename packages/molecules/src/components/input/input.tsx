import React from 'react'
import { InputProps } from './input.types'
import { Input as ChakraInput } from '@chakra-ui/react'
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
  return (
    <div className={Styles.input_container}>
      <ChakraInput
        className={Styles.input}
        variant={variant}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
      />
      {label && <label className={Styles.input_label}>{label}</label>}
      {error && <div className={Styles.error}>{error}</div>}
    </div>
  )
}

export default Input
