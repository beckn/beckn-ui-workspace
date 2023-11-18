import { TypographyProps } from '@chakra-ui/react'

type TextVariant =
  | 'titleSemibold'
  | 'titleRegular'
  | 'subTitleSemibold'
  | 'subTitleRegular'
  | 'subTextSemibold'
  | 'subTextRegular'
  | 'tagSemibold'
  | 'tagRegular'

export interface TypographyPropsModel extends TypographyProps {
  text: string
  variant?: TextVariant
  color?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: string
  fontStyle?: string
}
