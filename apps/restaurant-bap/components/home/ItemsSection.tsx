import React from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import FoodItemCard, { MenuItem } from './FoodItemCard'

interface ItemsSectionProps {
  title: string
  items: MenuItem[]
  viewMode: 'grid' | 'list'
  variant?: 'compact' | 'featured'
  columns?: {
    base: number
    sm: number
    md: number
    lg?: number
  }
  onItemClick: (id: number) => void
  onAddToCart: (item: MenuItem, e?: React.MouseEvent) => void
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  title,
  items,
  viewMode,
  variant = 'compact',
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  onItemClick,
  onAddToCart
}) => {
  if (items.length === 0) return null

  const gridColumns =
    viewMode === 'grid'
      ? {
          base: `repeat(${columns.base}, 1fr)`,
          sm: `repeat(${columns.sm}, 1fr)`,
          md: `repeat(${columns.md}, 1fr)`,
          lg: columns.lg ? `repeat(${columns.lg}, 1fr)` : undefined
        }
      : { base: '1fr', sm: '1fr' }

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
      <Grid
        templateColumns={gridColumns}
        gap={{ base: '16px', md: variant === 'featured' ? '24px' : '20px' }}
      >
        {items.map(item => (
          <FoodItemCard
            key={item.id}
            item={item}
            viewMode={viewMode}
            variant={variant}
            onClick={onItemClick}
            onAddToCart={onAddToCart}
          />
        ))}
      </Grid>
    </Box>
  )
}

export default ItemsSection
