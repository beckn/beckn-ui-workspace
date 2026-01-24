import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

const WelcomeSplashScreen: React.FC = () => {
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
      bgGradient="linear(to-br, #FF6B35, #F7931E)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px="24px"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999
      }}
    >
      <Flex
        direction="column"
        align="center"
        textAlign="center"
      >
        {/* Logo Icon */}
        <Box
          mb="32px"
          fontSize="80px"
          filter="drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
          sx={{
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' }
            },
            animation: 'bounce 2s ease-in-out infinite'
          }}
        >
          🍽️
        </Box>

        {/* Welcome Text */}
        <Text
          fontSize={['36px', '42px', '48px']}
          fontWeight="900"
          color="white"
          mb="16px"
          letterSpacing="tight"
          textShadow="0 4px 12px rgba(0,0,0,0.4)"
          lineHeight="1.2"
        >
          Welcome to
        </Text>
        <Text
          fontSize={['42px', '48px', '56px']}
          fontWeight="900"
          color="white"
          mb="40px"
          letterSpacing="tight"
          textShadow="0 4px 12px rgba(0,0,0,0.4)"
          lineHeight="1.1"
        >
          QuickBites
        </Text>

        {/* Loading Animation */}
        <Flex
          direction="column"
          align="center"
          gap="16px"
        >
          <Box
            w="60px"
            h="60px"
            border="4px solid white"
            borderTopColor="transparent"
            borderRadius="50%"
            sx={{
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              },
              animation: 'spin 1s linear infinite'
            }}
          />
          <Text
            fontSize="16px"
            color="whiteAlpha.900"
            fontWeight="500"
            textShadow="0 2px 8px rgba(0,0,0,0.3)"
          >
            Loading...
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default WelcomeSplashScreen
