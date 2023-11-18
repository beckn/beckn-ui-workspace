import React from 'react'
import { Text } from '@chakra-ui/react'
import { TypographyPropsModel } from './typography.types'

const Typography: React.FC<TypographyPropsModel> = ({ text, variant, color, ...restProps }) => {
  return (
    <Text
      variant={variant}
      color={color}
      {...restProps}
    >
      {text}
    </Text>
  )
}

export default Typography
