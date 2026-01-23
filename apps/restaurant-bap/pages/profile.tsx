import React from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'

const Profile = () => {
  const { t } = useLanguage()

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py="40px"
    >
      <Container maxW="800px">
        <Text
          fontSize="32px"
          fontWeight="700"
          mb="24px"
          color="gray.800"
        >
          Profile
        </Text>
        <Box
          bg="white"
          borderRadius="16px"
          p="32px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          <Text color="gray.600">Profile settings coming soon...</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Profile
