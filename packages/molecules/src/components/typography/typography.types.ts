import React from 'react'

type TextVariant =
  | 'titleSemibold'
  | 'titleRegular'
  | 'subTitleSemibold'
  | 'subTitleRegular'
  | 'subTextSemibold'
  | 'subTextRegular'
  | 'tagSemibold'
  | 'tagRegular'

export interface TypographyProps {
  text: string
  variant?: TextVariant
  color?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: string
  fontStyle?: string
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}
