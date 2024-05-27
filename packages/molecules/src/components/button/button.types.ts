import { IconProps } from '@chakra-ui/icons'
import { MouseEventHandler, ReactNode } from 'react'

type ButtonType = 'submit' | 'reset' | 'button'

export interface ButtonProps {
  text?: string
  className?: string
  handleClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  disabled?: boolean
  fullWidth?: boolean
  variant?: 'outline' | 'solid'
  colorScheme?: 'primary' | 'secondary'
  type?: ButtonType
  leftIcon?: React.FC<IconProps>
  isLoading?: boolean
  loadingText?: string
  color?: string
  id?: string
}
