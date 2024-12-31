import { SystemStyleObject } from '@chakra-ui/react'
import React from 'react'

export type TextVariant =
  | 'titleSemibold'
  | 'titleRegular'
  | 'subTitleSemibold'
  | 'subTitleRegular'
  | 'subTextSemibold'
  | 'subTextRegular'
  | 'tagSemibold'
  | 'tagRegular'

export interface TypographyProps {
  text: string | React.ReactNode
  variant?: TextVariant
  color?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: string
  fontStyle?: string
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  dataTest?: string
  sx?: SystemStyleObject | undefined
}
