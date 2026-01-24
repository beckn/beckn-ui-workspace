import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useHomePage } from '../hooks/useHomePage'
import { HeroSection, CategoryFilter, BannerCarousel } from '../components/home'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'

const HomePage = () => {
  const { t } = useLanguage()

  const {
    // State
    searchKeyword,
    selectedCategory,

    // Data
    categories,

    // Setters
    setSearchKeyword,

    // Handlers
    handleSearch,
    handleKeyPress,
    handleCategoryClick
  } = useHomePage()

  return (
    <Box
      minH="100vh"
      bg="gray.50"
    >
      {/* Hero Section with Search */}
      <HeroSection
        title={t.forAll || 'Order Food Online'}
        subtitle={t.subText || 'Discover the best restaurants and order your favorite food'}
        searchPlaceholder={t.searchPlaceholder || 'Search for food, restaurants...'}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />

      <Container
        maxW="1200px"
        px={['16px', '20px', '40px']}
        py={{ base: '24px', md: '40px' }}
      >
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
        {/* Banner Carousel */}
        <BannerCarousel />
      </Container>

      {/* Footer - Powered By Beckn */}
      <Box
        py="40px"
        mt="40px"
      >
        <PoweredBy
          logoSrc={'/images/footer.svg'}
          poweredByText={'Powered by'}
        />
      </Box>
    </Box>
  )
}

export default HomePage
