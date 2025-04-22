import { IconProps } from '@chakra-ui/icons'
import { SystemStyleObject } from '@chakra-ui/react'
import React, { MouseEventHandler, ReactNode } from 'react'

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
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  isLoading?: boolean
  loadingText?: string
  color?: string
  id?: string
  sx?: SystemStyleObject
  dataTest?: string
}
