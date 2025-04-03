import { Box } from '@chakra-ui/react'
import style from './layout.module.css'
import React from 'react'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <Box className={style.layout_container}> {children}</Box>
}

export default Layout
