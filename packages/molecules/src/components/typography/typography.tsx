import React from 'react'
import { Text } from '@chakra-ui/react'

type TextVariant =
  | 'titleSemibold'
  | 'titleRegular'
  | 'subTitleSemibold'
  | 'subTitleRegular'
  | 'subTextSemibold'
  | 'subTextRegular'
  | 'tagSemibold'
  | 'tagRegular'

interface TypographyProps {
  text: string
  variant?: TextVariant
  color?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: string
  fontStyle?: string
}

const Typography: React.FC<TypographyProps> = ({
  text,
  variant,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  fontStyle
}) => {
  return (
    <Text
      variant={variant}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
    >
      {text}
    </Text>
  )
}

export default Typography
