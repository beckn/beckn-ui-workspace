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
  textColor?: 'textPrimary' | 'textSecondary'
  type?: ButtonType
  leftIcon?: React.FC<IconProps>
}
