import React from 'react'
import { ButtonProps } from './button.types'
import { Button } from '@chakra-ui/react'

const BecknButton: React.FC<ButtonProps> = ({
  leftIcon,
  text,
  handleClick,
  className,
  children,
  disabled = false,
  fullWidth = true,
  variant = 'solid',
  colorScheme = 'primary',
  type = 'button',
  isLoading = false,
  loadingText = 'Loading'
}) => {
  return (
    <Button
      leftIcon={leftIcon}
      width={fullWidth ? 'full' : 'initial'}
      onClick={handleClick}
      className={className}
      isDisabled={disabled}
      variant={variant}
      colorScheme={colorScheme}
      type={type}
      loadingText={loadingText}
      isLoading={isLoading}
    >
      {children ? children : text}
    </Button>
  )
}

export default BecknButton
