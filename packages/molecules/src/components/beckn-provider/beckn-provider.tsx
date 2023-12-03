import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { generateTheme } from './beckn-provider.utils'
import { BecknProivderProps } from './beckn-provider.types'

//  Default theme https://github.com/chakra-ui/chakra-ui/tree/main/packages/components/theme/src/foundations

const BecknProvider: React.FC<BecknProivderProps> = ({ theme, children }) => {
  const generatedTheme = generateTheme(theme)
  return <ChakraProvider theme={generatedTheme}>{children}</ChakraProvider>
}

export default BecknProvider
