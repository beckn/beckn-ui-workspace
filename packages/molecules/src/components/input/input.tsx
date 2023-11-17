import React from 'react'
import { InputProps } from './input.types'
import { Input as ChakraInput } from '@chakra-ui/react'
import Styles from './input.module.css'

// TODO Assign classnames from outside
const Input: React.FC<InputProps> = ({ variant, type, value, name, placeholder, handleChange, label }) => {
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
      {/* {formErrors.password && <div className={style.error}>{formErrors.password}</div>} */}
    </div>
  )
}

export default Input
