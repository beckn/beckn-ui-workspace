import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

const landing = () => {
  const router = useRouter()
  return (
    <Box
      position={'relative'}
      height="100vh"
    >
      <Image
        src="/images/left.svg"
        position={'absolute'}
        bottom="0"
        left={'0'}
      />
      <Box>
        <Image
          margin={'0 auto'}
          src="/images/logo.svg"
          alt=""
          mb="36px"
        />
        <Text
          fontSize={'64px'}
          color="#4E4646"
          backdropFilter="blur(2px)"
          padding={'10px'}
          textAlign="center"
          lineHeight={'80px'}
          maxW="702px"
          margin={'0 auto'}
        >
          Welcome to the DEG Experience Center
        </Text>

        <Flex
          justifyContent="center"
          mt="180px"
          alignItems={'center'}
        >
          <Button
            rightIcon={
              <Image
                src="/images/arrow.svg"
                alt="arrow"
                w="28px"
                h="28px"
              />
            }
            bgGradient="linear-gradient(90.13deg, #E99060 2.76%, #A77CA5 38.62%)"
            color="#000"
            px="20px"
            py="10px"
            fontSize="28px"
            w="168px"
            h="62px"
            _hover={{
              opacity: 0.9
            }}
            borderRadius="full"
            onClick={() => {
              router.push('/home')
            }}
          >
            begin
          </Button>
        </Flex>
      </Box>
      <Image
        src="/images/right.svg"
        position={'absolute'}
        top="100px"
        right={'100px'}
      />
    </Box>
  )
}

export default landing
