import React from 'react'
import { Box, Container, Flex, Input, IconButton, Text, VStack } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'

interface HeroSectionProps {
  title: string
  subtitle: string
  searchPlaceholder: string
  searchKeyword: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  searchPlaceholder,
  searchKeyword,
  onSearchChange,
  onSearch,
  onKeyPress
}) => {
  return (
    <Box
      bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
      pb={{ base: '40px', md: '60px' }}
      pt={{ base: '30px', md: '40px' }}
    >
      <Container
        maxW="1200px"
        px={['16px', '20px', '40px']}
      >
        <VStack
          spacing={{ base: '16px', md: '24px' }}
          align="stretch"
        >
          {/* Main Heading */}
          <Box
            textAlign="center"
            mb={{ base: '16px', md: '20px' }}
          >
            <Text
              fontSize={['28px', '36px', '48px', '56px']}
              fontWeight="800"
              color="white"
              mb="8px"
              textShadow="0 2px 8px rgba(0,0,0,0.2)"
            >
              {title}
            </Text>
            <Text
              fontSize={['14px', '16px', '20px']}
              color="white"
              opacity={0.95}
              px="16px"
            >
              {subtitle}
            </Text>
          </Box>

          {/* Search Bar */}
          <Flex
            maxW="700px"
            mx="auto"
            w="100%"
            bg="white"
            borderRadius="50px"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
            overflow="hidden"
            h={{ base: '52px', md: '60px' }}
            align="center"
            pl={{ base: '16px', md: '24px' }}
            pr="6px"
          >
            <Input
              placeholder={searchPlaceholder}
              value={searchKeyword}
              onChange={e => onSearchChange(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter' && searchKeyword.trim()) {
                  onKeyPress(e)
                }
              }}
              border="none"
              h="100%"
              fontSize={{ base: '14px', md: '16px' }}
              _focus={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              _focusVisible={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              _active={{ outline: 'none', border: 'none' }}
              _placeholder={{ color: 'gray.400' }}
            />
            <IconButton
              aria-label="Search"
              icon={<FiSearch size="20px" />}
              bg={searchKeyword.trim() ? '#FF6B35' : '#E2E8F0'}
              color={searchKeyword.trim() ? 'white' : 'gray.400'}
              borderRadius="50%"
              minW={{ base: '40px', md: '48px' }}
              h={{ base: '40px', md: '48px' }}
              m="0"
              onClick={searchKeyword.trim() ? onSearch : undefined}
              cursor={searchKeyword.trim() ? 'pointer' : 'not-allowed'}
              isDisabled={!searchKeyword.trim()}
              _hover={searchKeyword.trim() ? { bg: '#E55A2B' } : {}}
              _disabled={{
                opacity: 1,
                cursor: 'not-allowed'
              }}
              transition="all 0.2s"
            />
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}

export default HeroSection
