//types
import React from 'react'
import { ButtonProps } from './Button.types'

const Button: React.FC<ButtonProps> = ({ handleClick, className, children }) => {
  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

export default Button
