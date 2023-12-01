import { MouseEventHandler, ReactNode } from 'react'

export interface ButtonProps {
  text?: string
  className?: string
  handleClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  disabled?: boolean
  fullWidth?: boolean
  variant?: 'outline' | 'solid'
  colorScheme?: 'primary' | 'secondary'
}
