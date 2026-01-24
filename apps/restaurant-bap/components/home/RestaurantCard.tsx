import React from 'react'
import { Box, Badge, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { FiStar, FiClock } from 'react-icons/fi'

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  etaMinutes: number
  image: string
  location: string
  itemCount: number
}

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: (name: string) => void
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
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
      onClick={() => onClick(restaurant.name)}
    >
      <Box
        position="relative"
        h="180px"
        bg="gray.100"
        overflow="hidden"
      >
        <Image
          src={restaurant.image}
          alt={restaurant.name}
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
          top="12px"
          right="12px"
          bg="white"
          color="gray.800"
          px="8px"
          py="4px"
          borderRadius="6px"
          fontSize="12px"
          fontWeight="600"
        >
          <HStack spacing="4px">
            <FiStar
              size="12px"
              fill="#FFD700"
              color="#FFD700"
            />
            <Text>{restaurant.rating.toFixed(1)}</Text>
          </HStack>
        </Badge>
      </Box>
      <VStack
        align="start"
        spacing="6px"
        p="16px"
      >
        <Text
          fontSize="18px"
          fontWeight="700"
          color="gray.800"
          noOfLines={1}
        >
          {restaurant.name}
        </Text>
        <Text
          fontSize="13px"
          color="gray.600"
          noOfLines={1}
        >
          {restaurant.cuisine}
        </Text>
        <HStack
          spacing="12px"
          fontSize="12px"
          color="gray.500"
        >
          <HStack spacing="4px">
            <FiClock size="12px" />
            <Text>{restaurant.etaMinutes} mins</Text>
          </HStack>
          <Text>•</Text>
          <Text>{restaurant.itemCount} items</Text>
        </HStack>
      </VStack>
    </Box>
  )
}

export default RestaurantCard
