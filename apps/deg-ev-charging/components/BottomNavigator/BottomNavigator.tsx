import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Image, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import HomeNavIcon from '@public/images/home_nav_icon.svg'
import SelectHomeNavIcon from '@public/images/select_home_nav_icon.svg'
import ChargerNavIcon from '@public/images/chargers_nav_icon.svg'
import SelectChargerNavIcon from '@public/images/select_chargers_nav_icon.svg'
import ProfileNavIcon from '@public/images/profile_nav_icon.svg'
import SelectProfileNavIcon from '@public/images/select_profile_nav_icon.svg'

const BottomNavigator = () => {
  const router = useRouter()
  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]

  const [selectedRoute, setSelectedRoute] = useState('/')

  useEffect(() => {
    // Get stored route from localStorage on component mount
    const storedRoute = localStorage.getItem('selectedRoute')
    if (storedRoute) {
      setSelectedRoute(storedRoute)
      // Only navigate if current route is different from stored route
      if (router.pathname !== storedRoute) {
        router.push(storedRoute)
      }
    }
  }, [])

  const handleNavigation = (path: string) => {
    setSelectedRoute(path)
    localStorage.setItem('selectedRoute', path)
    router.push(path)
  }

  const navItems = [
    {
      label: 'Home',
      icon: selectedRoute === '/' ? SelectHomeNavIcon : HomeNavIcon,
      path: '/',
      color: selectedRoute === '/' ? primaryColor : '#4B5FFA'
    },
    {
      label: 'Chargers',
      icon: selectedRoute === '/orderHistory' ? SelectChargerNavIcon : ChargerNavIcon,
      path: '/orderHistory',
      color: selectedRoute === '/orderHistory' ? primaryColor : '#4B5FFA'
    },
    {
      label: 'Profile',
      icon: selectedRoute === '/profile' ? SelectProfileNavIcon : ProfileNavIcon,
      path: '/profile',
      color: selectedRoute === '/profile' ? primaryColor : '#4B5FFA'
    }
  ]

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.5)"
      padding={'0.8rem 0'}
    >
      <Flex
        justify="space-around"
        align="center"
      >
        {navItems.map(item => (
          <Flex
            key={item.label}
            direction="column"
            align="center"
            cursor="pointer"
            onClick={() => handleNavigation(item.path)}
          >
            <Image
              src={item.icon}
              alt={item.label}
              boxSize={6}
            />
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={selectedRoute === item.path ? item.color || '#000000' : '#000000'}
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}

export default BottomNavigator
