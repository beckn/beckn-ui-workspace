import React from 'react'
import { Box } from '@chakra-ui/react'
import Header from '@components/header/Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
    >
      <Header />
      <Box as="main">{children}</Box>
    </Box>
  )
}

export default Layout
