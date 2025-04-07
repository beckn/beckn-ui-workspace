import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'

const Splash = () => {
  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems="center"
      height="100vh"
    >
      <Image
        src="./images/solaris_icon.svg"
        alt="splash-img"
        mb="20px"
      />
      <Image
        src="./images/splash-footer.svg"
        alt="splash-footer-img"
      />
    </Flex>
  )
}
export default Splash
