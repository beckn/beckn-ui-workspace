import React from 'react'
import { Box, Badge, Flex, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { FiStar, FiClock, FiPlus } from 'react-icons/fi'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  restaurant: string
  rating: number
  isVeg: boolean
  preparationTime: string
}

interface FoodItemCardProps {
  item: MenuItem
  viewMode: 'grid' | 'list'
  variant?: 'compact' | 'featured'
  onClick: (id: number) => void
  onAddToCart: (item: MenuItem, e?: React.MouseEvent) => void
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, viewMode, variant = 'compact', onClick, onAddToCart }) => {
  const isFeatured = variant === 'featured'

  // Responsive image dimensions for list view
  const getImageDimensions = () => {
    if (viewMode === 'list') {
      return {
        height: isFeatured ? { base: '100px', md: '150px' } : { base: '90px', md: '120px' },
        width: isFeatured ? { base: '100px', md: '200px' } : { base: '90px', md: '150px' },
        minWidth: isFeatured ? { base: '100px', md: '200px' } : { base: '90px', md: '150px' }
      }
    }
    return {
      height: isFeatured ? '200px' : '160px',
      width: '100%',
      minWidth: 'auto'
    }
  }

  const imageDimensions = getImageDimensions()

  return (
    <Box
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="0 2px 12px rgba(0,0,0,0.08)"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
      }}
      onClick={() => onClick(item.id)}
      display={viewMode === 'list' ? 'flex' : 'block'}
      flexDirection={viewMode === 'list' ? 'row' : 'column'}
    >
      {/* Image Section */}
      <Box
        position="relative"
        h={imageDimensions.height}
        w={imageDimensions.width}
        minW={imageDimensions.minWidth}
        flexShrink={0}
        bg="gray.100"
        overflow="hidden"
      >
        <Image
          src={item.image}
          alt={item.name}
          w="100%"
          h="100%"
          objectFit="cover"
          fallback={
            <Flex
              h="100%"
              align="center"
              justify="center"
              color="gray.400"
              fontSize="48px"
            >
              🍽️
            </Flex>
          }
        />
        <Badge
          position="absolute"
          top={isFeatured ? '12px' : '8px'}
          left={isFeatured ? '12px' : '8px'}
          bg={item.isVeg ? 'green.500' : 'red.500'}
          color="white"
          px={isFeatured ? '8px' : '6px'}
          py={isFeatured ? '4px' : '2px'}
          borderRadius={isFeatured ? '6px' : '4px'}
          fontSize={isFeatured ? '11px' : '10px'}
          fontWeight="600"
        >
          {item.isVeg ? 'VEG' : 'NON-VEG'}
        </Badge>
      </Box>

      {/* Content Section */}
      <VStack
        align="start"
        spacing={isFeatured ? '6px' : '4px'}
        p={viewMode === 'list' ? { base: '8px', md: '12px' } : isFeatured ? '16px' : '12px'}
        flex={viewMode === 'list' ? 1 : 'auto'}
        overflow="hidden"
        w={viewMode === 'list' ? 'auto' : '100%'}
        justify={viewMode === 'list' ? 'center' : 'flex-start'}
      >
        <Text
          fontSize={viewMode === 'list' ? { base: '14px', md: '16px' } : isFeatured ? '18px' : '16px'}
          fontWeight={isFeatured ? '700' : '600'}
          color="gray.800"
          noOfLines={1}
          w="100%"
        >
          {item.name}
        </Text>

        {isFeatured ? (
          <>
            {viewMode !== 'list' && (
              <Text
                fontSize="14px"
                color="gray.600"
                noOfLines={2}
                minH="40px"
              >
                {item.description}
              </Text>
            )}
            <Flex
              justify="space-between"
              w="100%"
              pt={viewMode === 'list' ? '4px' : '8px'}
              flexWrap="wrap"
              gap="8px"
            >
              <HStack spacing={{ base: '8px', md: '12px' }}>
                <HStack spacing="4px">
                  <FiStar
                    size="14px"
                    fill="#FFD700"
                    color="#FFD700"
                  />
                  <Text
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight="600"
                    color="gray.700"
                  >
                    {item.rating}
                  </Text>
                </HStack>
                <HStack spacing="4px">
                  <FiClock size="12px" />
                  <Text
                    fontSize={{ base: '10px', md: '12px' }}
                    color="gray.500"
                  >
                    {item.preparationTime}
                  </Text>
                </HStack>
              </HStack>
              <HStack
                spacing={{ base: '4px', md: '8px' }}
                align="center"
              >
                <Text
                  fontSize={{ base: '16px', md: '20px' }}
                  fontWeight="700"
                  color="#FF6B35"
                >
                  ₹{item.price}
                </Text>
                <IconButton
                  aria-label="Add to Cart"
                  icon={<FiPlus />}
                  size="xs"
                  bg="#FF6B35"
                  color="white"
                  borderRadius="full"
                  onClick={e => onAddToCart(item, e)}
                  _hover={{ bg: '#E55A2B' }}
                />
              </HStack>
            </Flex>
          </>
        ) : (
          <>
            {viewMode !== 'list' && (
              <Text
                fontSize="13px"
                color="gray.600"
                noOfLines={1}
              >
                {item.restaurant}
              </Text>
            )}
            <Flex
              justify="space-between"
              w="100%"
              flexWrap="wrap"
              gap="4px"
            >
              <HStack spacing="4px">
                <FiStar
                  size="12px"
                  fill="#FFD700"
                  color="#FFD700"
                />
                <Text
                  fontSize={{ base: '11px', md: '13px' }}
                  fontWeight="600"
                  color="gray.700"
                >
                  {item.rating}
                </Text>
              </HStack>
              <HStack
                spacing={{ base: '4px', md: '8px' }}
                align="center"
              >
                <Text
                  fontSize={{ base: '14px', md: '18px' }}
                  fontWeight="700"
                  color="#FF6B35"
                >
                  ₹{item.price}
                </Text>
                <IconButton
                  aria-label="Add to Cart"
                  icon={<FiPlus />}
                  size="xs"
                  bg="#FF6B35"
                  color="white"
                  borderRadius="full"
                  onClick={e => onAddToCart(item, e)}
                  _hover={{ bg: '#E55A2B' }}
                />
              </HStack>
            </Flex>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default FoodItemCard
