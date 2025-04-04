import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider
} from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface ExperienceCardProps {
  title: string
  icon: string
  url: string
  isDisabled?: boolean
}

const ExperienceCard = ({ title, icon, url, isDisabled = false }: ExperienceCardProps) => {
  const router = useRouter()

  useEffect(() => {
    const countryData = {
      country: {
        name: 'United States',
        code: 'USA'
      }
    }
    Cookies.set('country_code', JSON.stringify(countryData), {
      path: '/',
      sameSite: 'strict'
    })
  }, [])

  const countryCookie = Cookies.get('country_code')

  const decodedCookie = countryCookie ? decodeURIComponent(countryCookie) : ''

  console.log(decodedCookie)

  return (
    <Box
      w="311px"
      height={'284px'}
      bg={isDisabled ? '#fff' : 'white'}
      borderRadius="34px"
      border={'1px solid #000'}
      p="24px"
      position="relative"
      overflow="hidden"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      transition="all 0.3s ease"
      _hover={{ transform: isDisabled ? 'translateY(-20px)' : 'translateY(-20px)' }}
      opacity={isDisabled ? 1 : 1}
      onClick={() => {
        if (!isDisabled && url) {
          router.push(`/landing?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
        }
      }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        height="60px"
        bgGradient={
          isDisabled
            ? 'linear-gradient(89.78deg, #D2CCC6 0.3%, #C2C2C2 99.93%)'
            : 'linear-gradient(89.78deg, #FABD74 0.3%, #F6A468 99.93%)'
        }
        borderBottomRightRadius="34px"
      >
        <Text
          fontSize={'20px'}
          color={isDisabled ? 'gray.600' : '#000000'}
          p="16px"
        >
          {title}
        </Text>
      </Box>
      <Box
        pt="70px"
        display="flex"
        justifyContent="center"
      >
        <Image
          src={icon}
          alt={title}
          opacity={isDisabled ? 0.5 : 1}
        />
      </Box>
    </Box>
  )
}

const Home = () => {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'USA',
    fullName: 'USA',
    flag: '/images/usa.svg',
    data: {
      country: {
        name: 'United States',
        code: 'USA'
      }
    }
  })

  const countries = [
    {
      name: 'USA',
      fullName: 'USA',
      flag: '/images/usa.svg',
      data: {
        country: {
          name: 'United States',
          code: 'USA'
        }
      }
    },
    {
      name: 'IND',
      fullName: 'IND',
      flag: '/images/india.svg',
      data: {
        country: {
          name: 'India',
          code: 'IND'
        }
      }
    }
  ]

  const experiences: Array<{ title: string; icon: string; url: string }> = [
    { title: 'Retail Experience', icon: '/images/retail.svg', url: process.env.NEXT_PUBLIC_OPEN_SPARK_RETAIL || '' },
    { title: 'Rental Experience', icon: '/images/rental.svg', url: process.env.NEXT_PUBLIC_OPEN_SPARK_RENTAL || '' },
    { title: 'Wallet Experience', icon: '/images/wallet.svg', url: process.env.NEXT_PUBLIC_OPEN_SPARK_WALLET || '' },
    {
      title: 'Finance Experience',
      icon: '/images/finance.svg',
      url: process.env.NEXT_PUBLIC_OPEN_SPARK_LEND_EASE || ''
    },
    { title: 'P2P Energy Trading', icon: '/images/p2p.svg', url: '' },
    { title: 'EV Charging', icon: '/images/charging.svg', url: '' }
  ]

  console.log(experiences)

  return (
    <Box
      p="60px"
      backgroundImage={'/images/Home.svg'}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb="80px"
      >
        <Image
          src="/images/logo.svg"
          alt="Digital Energy Grid"
        />

        <Box
          maxW={'50rem'}
          textAlign="center"
          position="relative"
          padding="10px 20px"
          backdropFilter="blur(10px)"
          backgroundColor="#9D9D9D03"
          backdrop-filter="blur(69.5999984741211px)"
        >
          <Text
            as={'span'}
            fontSize={'32px'}
            fontWeight="600"
          >
            <Text
              fontSize={'32px'}
              fontWeight="600"
            >
              Welcome to the
            </Text>{' '}
            <Text
              as={'span'}
              fontSize={'32px'}
              fontWeight="600"
              background="linear-gradient(90.13deg, #E99060 2.76%, #A77CA5 38.62%)"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Digital Energy Grid (DEG)
            </Text>{' '}
            experience centre
          </Text>
        </Box>

        <Menu>
          <MenuButton
            background={'#fff'}
            as={Button}
            variant="outline"
            color={'#000'}
            leftIcon={
              <Image
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                w="24px"
                h="24px"
              />
            }
            borderRadius="full"
            px="24px"
            py="12px"
          >
            {selectedCountry.name}
          </MenuButton>
          <MenuList
            borderRadius="20px"
            p="10px"
            border="1px solid #E2E8F0"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          >
            {countries.map(country => (
              <MenuItem
                key={country.name}
                icon={
                  <Image
                    src={country.flag}
                    alt={country.name}
                    w="24px"
                    h="24px"
                  />
                }
                onClick={() => {
                  Cookies.remove('country_code')
                  setSelectedCountry(country)

                  Cookies.set('country_code', JSON.stringify(country.data), {
                    path: '/',
                    sameSite: 'strict'
                  })
                }}
                borderRadius="12px"
                _hover={{ bg: 'gray.50' }}
              >
                {country.fullName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      <Box>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap="24px"
          maxW="980px"
          mx="auto"
          position="relative"
          zIndex="1"
        >
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={index}
              title={exp.title}
              icon={exp.icon}
              url={exp.url}
              isDisabled={exp.title === 'P2P Energy Trading' || exp.title === 'EV Charging'}
            />
          ))}
        </Grid>
      </Box>

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
    </Box>
  )
}

export default Home
