import { Divider, Box, Image } from '@chakra-ui/react'
import router from 'next/router'
import React from 'react'

const Navbar = () => {
  return (
    <Box
      w={'50px'}
      h="104px"
      boxShadow="16px 17px 22px 23px #00000008"
      borderRadius={'50px'}
      bg="#fff"
      p="6px"
      position={'absolute'}
      right="60px"
      top={'calc(50vh - 25px)'}
      display="flex"
      justifyContent={'center'}
      alignItems="center"
      flexDirection={'column'}
    >
      <Image
        src="/images/homeIcon.svg"
        alt=""
        cursor={'pointer'}
        onClick={() => router.push('/home')}
      />
      <Divider />
      <Image
        src="/images/exitIcon.svg"
        alt=""
        cursor={'pointer'}
        onClick={() => router.push('/')}
      />
    </Box>
  )
}

export default Navbar
