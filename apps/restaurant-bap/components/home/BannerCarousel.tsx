import React, { useState, useEffect, useCallback } from 'react'
import { Box, Flex, Image, IconButton, HStack } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const BANNERS = [
  { id: 1, src: '/images/food-banner-proper-hero.svg', alt: 'Order Your Favourite Food', bg: '#E8F4FD' },
  { id: 2, src: '/images/food-banner-2-offer.svg', alt: 'Flat 50% OFF', bg: '#1E3A5F' },
  { id: 3, src: '/images/food-banner-new-user-offer.svg', alt: 'New User Offer', bg: '#FFF5E6' },
  { id: 4, src: '/images/food-banner-delivery-pro.svg', alt: 'Fast Delivery', bg: '#E6F7E6' }
]

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % BANNERS.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + BANNERS.length) % BANNERS.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      borderRadius={{ base: '12px', md: '20px' }}
      boxShadow="0 4px 20px rgba(0,0,0,0.1)"
      bg="#E8F4FD"
      mb={{ base: '24px', md: '40px' }}
      h={{ base: '180px', sm: '220px', md: '280px', lg: '350px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Carousel Container */}
      <Box
        display="flex"
        transition="transform 0.6s ease-in-out"
        transform={`translateX(-${currentIndex * 100}%)`}
        h="100%"
      >
        {BANNERS.map(banner => (
          <Box
            key={banner.id}
            minW="100%"
            w="100%"
            h="100%"
            bg={banner.bg || '#E8F4FD'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              maxW="100%"
              maxH="100%"
              objectFit="contain"
              objectPosition="center"
            />
          </Box>
        ))}
      </Box>

      {/* Dot Indicators */}
      <HStack
        position="absolute"
        bottom={{ base: '8px', md: '16px' }}
        left="50%"
        transform="translateX(-50%)"
        spacing={{ base: '6px', md: '8px' }}
        zIndex={2}
      >
        {BANNERS.map((_, index) => (
          <Box
            key={index}
            as="button"
            w={{ base: '8px', md: '10px' }}
            h={{ base: '8px', md: '10px' }}
            borderRadius="full"
            bg={index === currentIndex ? '#FF6B35' : 'white'}
            border="2px solid"
            borderColor={index === currentIndex ? '#FF6B35' : 'white'}
            boxShadow="0 2px 4px rgba(0,0,0,0.2)"
            transition="all 0.3s"
            transform={index === currentIndex ? 'scale(1.2)' : 'scale(1)'}
            onClick={() => goToSlide(index)}
            _hover={{ transform: 'scale(1.3)' }}
          />
        ))}
      </HStack>

      {/* Progress Bar */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        h="3px"
        bg="rgba(255,107,53,0.3)"
        w="100%"
      >
        <Box
          h="100%"
          bg="#FF6B35"
          w={`${((currentIndex + 1) / BANNERS.length) * 100}%`}
          transition="width 0.5s ease"
        />
      </Box>
    </Box>
  )
}

export default BannerCarousel
