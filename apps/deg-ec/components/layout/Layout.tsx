import { Box } from '@chakra-ui/react'
import style from './Layout.module.css'
import React from 'react'
import Head from 'next/head'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>DEG</title>
      </Head>
      <Box className={style.layout_container}> {children}</Box>
    </>
  )
}

export default Layout
