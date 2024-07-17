import React from 'react'
import { Text } from '@chakra-ui/react'

import { TypographyProps } from './typography.types'

const Typography: React.FC<TypographyProps> = ({
  text,
  variant,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  fontStyle,
  className,
  style,
  onClick,
  dataTest
}) => {
  return (
    <Text
      className={className}
      variant={variant}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      style={style}
      onClick={onClick}
      data-test={dataTest}
    >
      {text}
    </Text>
  )
}

export default Typography
