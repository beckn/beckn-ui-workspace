import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, Input, Flex, IconButton } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { RootState } from '@store/index'
import { setSearchTerm, SearchTermModel } from '@beckn-ui/common/src/store/search-slice'
import { useGeolocation } from '@beckn-ui/common'

const HomePage = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()
  const { searchTerm } = useSelector((state: RootState) => state.search)
  const [searchKeyword, setSearchKeyword] = useState('')

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    if ((searchTerm as SearchTermModel)?.searchKeyword) {
      setSearchKeyword((searchTerm as SearchTermModel).searchKeyword)
    }
  }, [searchTerm])

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      dispatch(setSearchTerm({ searchKeyword: searchKeyword.trim() }))
      router.push('/search')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box
      minH="calc(100vh - 80px)"
      bg="linear-gradient(180deg, #FF6B35 0%, #FFFFFF 30%)"
    >
      <Container
        maxW="1200px"
        py="60px"
        px={['20px', '40px']}
      >
        <Box
          textAlign="center"
          mb="50px"
        >
          <Box
            fontSize={['32px', '48px', '56px']}
            fontWeight="800"
            color="white"
            mb="16px"
            textShadow="0 2px 8px rgba(0,0,0,0.2)"
          >
            {t.forAll}
          </Box>
          <Box
            fontSize={['16px', '20px']}
            color="white"
            opacity={0.95}
            mb="40px"
          >
            {t.subText}
          </Box>

          <Flex
            maxW="600px"
            mx="auto"
            bg="white"
            borderRadius="50px"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
            overflow="hidden"
            p="4px"
          >
            <Input
              placeholder={t.searchPlaceholder}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              border="none"
              fontSize="16px"
              px="24px"
              py="16px"
              _focus={{ outline: 'none' }}
              _placeholder={{ color: 'gray.400' }}
            />
            <IconButton
              aria-label="Search"
              icon={<FiSearch />}
              bg="#FF6B35"
              color="white"
              borderRadius="50px"
              size="lg"
              onClick={handleSearch}
              _hover={{ bg: '#E55A2B' }}
            />
          </Flex>

          {currentAddress && (
            <Box
              mt="20px"
              fontSize="14px"
              color="white"
              opacity={0.9}
            >
              📍 {currentAddress}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
