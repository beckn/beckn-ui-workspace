import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import HomeNavIcon from '@public/images/home_nav_icon.svg'
import SelectHomeNavIcon from '@public/images/select_home_nav_icon.svg'
import ChargerNavIcon from '@public/images/chargers_nav_icon.svg'
import SelectChargerNavIcon from '@public/images/select_chargers_nav_icon.svg'
import ProfileNavIcon from '@public/images/profile_nav_icon.svg'
import SelectProfileNavIcon from '@public/images/select_profile_nav_icon.svg'

const BottomNavigator = () => {
  const router = useRouter()
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
      color: selectedRoute === '/' ? 'var(--ev-primary)' : undefined
    },
    {
      label: 'Chargers',
      icon: selectedRoute === '/orderHistory' ? SelectChargerNavIcon : ChargerNavIcon,
      path: '/orderHistory',
      color: selectedRoute === '/orderHistory' ? 'var(--ev-primary)' : undefined
    },
    {
      label: 'Profile',
      icon: selectedRoute === '/profile' ? SelectProfileNavIcon : ProfileNavIcon,
      path: '/profile',
      color: selectedRoute === '/profile' ? 'var(--ev-primary)' : undefined
    }
  ]

  return (
    <Box
      className="ev-app"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="var(--ev-surface)"
      borderTop="1px solid"
      borderColor="var(--ev-border)"
      boxShadow="0 -2px 8px rgba(0,0,0,0.06)"
      pt={3}
      pb={3}
      pl="var(--ev-safe-left)"
      pr="var(--ev-safe-right)"
      zIndex={40}
      style={{ paddingBottom: 'calc(0.75rem + var(--ev-safe-bottom))' }}
    >
      <Flex
        justify="space-around"
        align="stretch"
        gap={4}
      >
        {navItems.map(item => (
          <Flex
            key={item.label}
            direction="column"
            align="center"
            justify="center"
            cursor="pointer"
            onClick={() => handleNavigation(item.path)}
            minHeight="44px"
            minWidth="64px"
            flex={1}
            paddingY={1}
            paddingX={2}
            borderRadius="lg"
            _active={{ bg: 'var(--ev-bg)' }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              boxSize={7}
              mb={0.5}
            />
            <Text
              fontSize="xs"
              fontWeight="medium"
              color={item.color ?? 'var(--ev-text-muted)'}
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
