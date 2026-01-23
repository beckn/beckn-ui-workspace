import React, { useState } from 'react'
import { Box, Container, Text, Textarea, Button, VStack, Input, FormControl, FormLabel } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'

const Support = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle support form submission
    console.log('Support form submitted:', formData)
    alert('Thank you for contacting us! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

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
          mb="8px"
          color="gray.800"
        >
          Contact Support
        </Text>
        <Text
          fontSize="16px"
          color="gray.600"
          mb="32px"
        >
          We're here to help! Send us a message and we'll respond as soon as possible.
        </Text>

        <Box
          bg="white"
          borderRadius="16px"
          p="32px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          <form onSubmit={handleSubmit}>
            <VStack
              spacing="24px"
              align="stretch"
            >
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this regarding?"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  size="lg"
                  rows={6}
                />
              </FormControl>

              <Button
                type="submit"
                bg="#FF6B35"
                color="white"
                size="lg"
                fontSize="16px"
                fontWeight="700"
                _hover={{ bg: '#E55A2B' }}
                width="100%"
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default Support
