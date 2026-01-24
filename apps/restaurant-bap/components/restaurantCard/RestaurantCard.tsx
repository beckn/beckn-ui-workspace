import React from 'react'
import { Box, Flex, Text, Image, Badge } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'

interface RestaurantCardProps {
  name: string
  image?: string
  rating?: string
  deliveryTime?: string
  cuisine?: string
  distance?: string
  isPromoted?: boolean
  offer?: string
  onClick?: () => void
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  rating = '4.0',
  deliveryTime = '30-40 min',
  cuisine = 'Fast Food',
  distance,
  isPromoted = false,
  offer,
  onClick
}) => {
  return (
    <Box
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="0 2px 12px rgba(0,0,0,0.08)"
      position="relative"
      mb="24px"
      cursor="pointer"
      transition="all 0.3s"
      className="food-delivery-card"
      onClick={onClick}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
      }}
    >
      {isPromoted && (
        <Badge
          position="absolute"
          top="12px"
          left="12px"
          bg="rgba(0,0,0,0.7)"
          color="white"
          fontSize="11px"
          fontWeight="600"
          px="8px"
          py="4px"
          borderRadius="6px"
          zIndex={2}
        >
          PROMOTED
        </Badge>
      )}
      {offer && (
        <Badge
          position="absolute"
          top="12px"
          right="12px"
          bg="#FF6B35"
          color="white"
          fontSize="11px"
          fontWeight="600"
          px="8px"
          py="4px"
          borderRadius="6px"
          zIndex={2}
        >
          {offer}
        </Badge>
      )}
      <Box
        position="relative"
        width="100%"
        height="200px"
        bg="gray.100"
        overflow="hidden"
        className="restaurant-card-image"
      >
        <Image
          src={image || '/images/restaurant-placeholder.svg'}
          alt={name}
          width="100%"
          height="100%"
          objectFit="cover"
          fallbackSrc="/images/restaurant-placeholder.svg"
        />
      </Box>
      <Box p="20px">
        <Text
          fontSize="20px"
          fontWeight="700"
          color="gray.800"
          mb="10px"
          noOfLines={1}
        >
          {name}
        </Text>
        <Flex
          alignItems="center"
          gap="16px"
          mb="10px"
          flexWrap="wrap"
        >
          <Flex
            alignItems="center"
            gap="6px"
            bg="#FFF4F0"
            px="8px"
            py="4px"
            borderRadius="6px"
          >
            <StarIcon
              color="#FF6B35"
              boxSize="16px"
            />
            <Text
              fontSize="14px"
              fontWeight="700"
              color="#FF6B35"
            >
              {rating}
            </Text>
          </Flex>
          <Text
            fontSize="14px"
            color="gray.600"
            fontWeight="500"
          >
            {deliveryTime}
          </Text>
          {distance && (
            <Text
              fontSize="14px"
              color="gray.600"
              fontWeight="500"
            >
              {distance}
            </Text>
          )}
        </Flex>
        <Text
          fontSize="14px"
          color="gray.500"
          fontWeight="500"
          noOfLines={1}
        >
          {cuisine}
        </Text>
      </Box>
    </Box>
  )
}

export default RestaurantCard
