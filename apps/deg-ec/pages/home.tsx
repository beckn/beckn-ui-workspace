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
  MenuItem
} from '@chakra-ui/react'
import React, { useState } from 'react'

interface ExperienceCardProps {
  title: string
  icon: string
}

const ExperienceCard = ({ title, icon }: ExperienceCardProps) => {
  return (
    <Box
      w="311px"
      height={'284px'}
      bg="white"
      borderRadius="34px"
      border={'1px solid #000'}
      p="24px"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{ transform: 'translateY(-20px)' }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        height="60px"
        // width="150px"
        bgGradient="linear-gradient(89.78deg, #FABD74 0.3%, #F6A468 99.93%)"
        borderBottomRightRadius="34px"
      >
        <Text
          fontSize={'20px'}
          color="#000000"
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
        />
      </Box>
    </Box>
  )
}

const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState({ name: 'USA', flag: '/images/usa.svg' })

  const countries = [
    { name: 'USA', fullName: 'United States', flag: '/images/usa.svg' },
    { name: 'IND', fullName: 'India', flag: '/images/india.svg' }
  ]

  const experiences = [
    { title: 'Retail Experience', icon: '/images/retail.svg' },
    { title: 'Rental Experience', icon: '/images/rental.svg' },
    { title: 'Wallet Experience', icon: '/images/wallet.svg' },
    { title: 'Finance Experience', icon: '/images/finance.svg' },
    { title: 'P2P Energy Trading', icon: '/images/p2p.svg' },
    { title: 'EV Charging', icon: '/images/charging.svg' }
  ]

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
              Digital Energy Grid (D.E.G)
            </Text>{' '}
            experience centre
          </Text>
        </Box>

        <Menu>
          <MenuButton
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
                onClick={() => setSelectedCountry(country)}
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
            />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
