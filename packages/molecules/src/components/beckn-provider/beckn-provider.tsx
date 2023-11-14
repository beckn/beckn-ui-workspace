import React, { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { becknTheme } from '@lib/types'
import { generateTheme } from './beckn-provider.utils'

interface BecknProivderProps {
  theme: becknTheme
  children: ReactNode
}

const BecknProvider: React.FC<BecknProivderProps> = ({ theme, children }) => {
  const generatedTheme = generateTheme(theme)
  return <ChakraProvider theme={generatedTheme}>{children}</ChakraProvider>
}

export default BecknProvider
