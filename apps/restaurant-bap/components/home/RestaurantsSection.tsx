import React from 'react'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import RestaurantCard, { Restaurant } from './RestaurantCard'

interface RestaurantsSectionProps {
  title: string
  restaurants: Restaurant[]
  onRestaurantClick: (name: string) => void
}

const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ title, restaurants, onRestaurantClick }) => {
  if (restaurants.length === 0) return null

  return (
    <Box mb={{ base: '32px', md: '50px' }}>
      <Text
        fontSize={{ base: '20px', md: '24px' }}
        fontWeight="700"
        color="gray.800"
        mb={{ base: '16px', md: '24px' }}
      >
        {title}
      </Text>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: '16px', md: '20px' }}
      >
        {restaurants.slice(0, 8).map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={onRestaurantClick}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default RestaurantsSection
