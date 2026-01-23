import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import RestaurantCard from '../restaurantCard/RestaurantCard'
import FoodItemCard from '../foodItemCard/FoodItemCard'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'

interface RestaurantSectionProps {
  restaurant: {
    id: string
    name: string
    image?: string
    rating?: string
    deliveryTime?: string
    cuisine?: string
    distance?: string
    offer?: string
  }
  items: ParsedItemModel[]
  onItemClick: (item: ParsedItemModel) => void
  onAddToCart: (item: ParsedItemModel) => void
}

const RestaurantSection: React.FC<RestaurantSectionProps> = ({ restaurant, items, onItemClick, onAddToCart }) => {
  return (
    <Box mb="40px">
      <RestaurantCard
        name={restaurant.name}
        image={restaurant.image}
        rating={restaurant.rating}
        deliveryTime={restaurant.deliveryTime}
        cuisine={restaurant.cuisine}
        distance={restaurant.distance}
        offer={restaurant.offer}
      />
      <VStack
        spacing="14px"
        align="stretch"
        mt="20px"
      >
        {items.map(item => (
          <FoodItemCard
            key={item.id}
            id={item.id}
            name={item.item.name}
            description={item.item.short_desc || item.item.long_desc}
            price={item.item.price.value}
            currency={item.item.price.currency || '₹'}
            image={item.item.images?.[0]?.url}
            onAddClick={() => onAddToCart(item)}
            onItemClick={() => onItemClick(item)}
          />
        ))}
      </VStack>
    </Box>
  )
}

export default RestaurantSection
