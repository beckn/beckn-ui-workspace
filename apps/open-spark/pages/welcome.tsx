import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import welcomeLogo from '../public/images/welcome.svg'

const welcome = () => {
  const router = useRouter()
  return (
    <Box>
      <Flex
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        marginBottom={'100px'}
      >
        <Image
          src={welcomeLogo}
          alt="welcome_logo"
        />
        <Text
          fontSize="24px"
          fontWeight={400}
        >
          Hello,
        </Text>
        <Text
          fontSize="24px"
          fontWeight={400}
        >
          Welcome to Open Spark
        </Text>
      </Flex>
      <Flex
        margin={{ base: '0px', lg: '150px', md: '100px' }}
        flexDir={'column'}
        rowGap={'10px'}
      >
        <BecknButton
          dataTest={'consumer_button'}
          children="I am a Consumer"
          handleClick={() => router.push('/consumer')}
          variant="solid"
        />
        <BecknButton
          dataTest={'producer_button'}
          children="I am a Producer"
          handleClick={() => router.push('/producer')}
          variant="outline"
        />
      </Flex>
    </Box>
  )
}

export default welcome
