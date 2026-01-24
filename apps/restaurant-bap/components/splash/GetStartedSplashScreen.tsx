import React from 'react'
import { Box, Flex, Text, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface GetStartedSplashScreenProps {
  onGetStarted?: () => void
}

const GetStartedSplashScreen: React.FC<GetStartedSplashScreenProps> = ({ onGetStarted }) => {
  const router = useRouter()

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted()
    } else {
      router.push('/signIn')
    }
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex={99999}
      minH="100vh"
      w="100vw"
      bgGradient="linear(to-t, #FF6B35 0%, #FF8C42 50%, #FFA366 100%)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      px="24px"
      py="60px"
      overflow="hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999
      }}
    >
      {/* Cityscape Silhouette */}
      <Box
        position="absolute"
        bottom="120px"
        left="0"
        right="0"
        w="100%"
        h="150px"
        opacity={0.3}
        sx={{
          background: `
            linear-gradient(to top, 
              rgba(0,0,0,0.2) 0%, 
              transparent 100%
            ),
            url("data:image/svg+xml,%3Csvg width='400' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,150 L50,100 L100,120 L150,80 L200,110 L250,70 L300,90 L350,60 L400,100 L400,150 Z' fill='%23D2691E'/%3E%3C/svg%3E") repeat-x bottom
          `,
          backgroundSize: '400px 150px',
          backgroundPosition: 'bottom'
        }}
      />

      {/* Food Illustrations - More visible behind Get Started button */}
      <Box
        position="absolute"
        bottom="180px"
        left="5%"
        fontSize="100px"
        opacity={0.9}
        transform="rotate(-15deg)"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        zIndex={1}
      >
        🍔
      </Box>
      <Box
        position="absolute"
        bottom="200px"
        right="8%"
        fontSize="90px"
        opacity={0.9}
        transform="rotate(12deg)"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        zIndex={1}
      >
        🍕
      </Box>
      <Box
        position="absolute"
        bottom="170px"
        right="2%"
        fontSize="75px"
        opacity={0.9}
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        zIndex={1}
      >
        🥤
      </Box>
      <Box
        position="absolute"
        bottom="160px"
        left="15%"
        fontSize="60px"
        opacity={0.85}
        transform="rotate(25deg)"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        zIndex={1}
      >
        🛵
      </Box>

      {/* Main Content */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        zIndex={2}
        mt="auto"
        mb="auto"
      >
        {/* Logo Icon - Cloche with spoon and fork */}
        <Box
          mb="24px"
          fontSize="64px"
          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        >
          🍽️
        </Box>

        {/* App Name */}
        <Text
          fontSize={['42px', '48px', '56px']}
          fontWeight="900"
          color="white"
          mb="12px"
          letterSpacing="tight"
          textShadow="0 4px 12px rgba(0,0,0,0.4)"
          lineHeight="1.1"
        >
          QuickBites
        </Text>

        {/* Tagline */}
        <Text
          fontSize={['16px', '18px', '20px']}
          color="white"
          mb="60px"
          maxW="320px"
          fontWeight="500"
          textShadow="0 2px 8px rgba(0,0,0,0.3)"
          opacity={0.95}
        >
          Fast & Delicious Food, Anytime!
        </Text>
      </Flex>

      {/* Get Started Button */}
      <Button
        size="lg"
        w="85%"
        maxW="320px"
        h="56px"
        borderRadius="16px"
        bgGradient="linear(to-r, #FF6B35, #FF8C42)"
        color="white"
        fontSize="18px"
        fontWeight="700"
        letterSpacing="0.5px"
        boxShadow="0 8px 24px rgba(255, 107, 53, 0.4), 0 4px 8px rgba(0,0,0,0.2)"
        _hover={{
          bgGradient: 'linear(to-r, #FF8C42, #FFA366)',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(255, 107, 53, 0.5), 0 6px 12px rgba(0,0,0,0.3)'
        }}
        _active={{
          transform: 'translateY(0px)',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
        }}
        transition="all 0.3s ease"
        onClick={handleGetStarted}
        zIndex={3}
        mb="40px"
        position="relative"
      >
        Get Started
      </Button>
    </Box>
  )
}

export default GetStartedSplashScreen
