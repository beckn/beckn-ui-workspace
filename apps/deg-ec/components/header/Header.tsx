import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

interface HeaderProps {
  experienceTitle: string
}

const Header: React.FC<HeaderProps> = ({ experienceTitle }) => {
  const getPageText = (title: string) => {
    switch (title) {
      case 'Retail Consumer':
        return ' experience for purchasing and renting out energy services'
      case 'Rental':
        return 'experience for discovering and renting energy related equipments'
      case 'Wallet':
        return 'experience for securely storing all your assets, transactions and documentation in one place'
      case 'Finance':
        return 'experience for bankers to monitor and manage loan requests'
      case 'P2P ':
        return 'Energy Trading experience to trade excess energy directly with peers in real time'
      case 'EV Charging':
        return 'experience to locate, book, and start EV charging sessions in real time'
      default:
        return ''
    }
  }

  const router = useRouter()
  return (
    <Box>
      <Flex
        alignItems={'center'}
        justifyContent="space-between"
        mb="30px"
      >
        <Image
          src="/images/logo.svg"
          alt=""
          cursor="pointer"
          onClick={() => router.push('/home')}
        />
        <Box
          maxW={'880px'}
          textAlign="center"
          position="relative"
          padding="10px 20px"
          backdropFilter="blur(10px)"
          backgroundColor="#9D9D9D03"
        >
          <Text
            as={'span'}
            fontSize={'32px'}
            fontWeight="600"
          >
            <Text
              as={'span'}
              fontSize={'32px'}
              fontWeight="600"
              background="linear-gradient(90.13deg, #E99060 2.76%, #A77CA5 38.62%)"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {experienceTitle}
            </Text>{' '}
            {getPageText(experienceTitle)}
          </Text>
        </Box>
        <Text w={'130px'}></Text>
      </Flex>
    </Box>
  )
}

export default Header
