import { Flex, Divider, Text } from '@chakra-ui/react'
import React from 'react'

const AuthDivider = () => {
  return (
    <Flex
      align="center"
      p={'20px 0 30px'}
    >
      <Divider />
      <Text
        ml={'20px'}
        mr="20px"
        fontSize={'15px'}
        color="#A7A7A7"
      >
        Or
      </Text>
      <Divider />
    </Flex>
  )
}

export default AuthDivider
