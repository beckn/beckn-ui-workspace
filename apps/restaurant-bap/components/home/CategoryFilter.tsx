import React from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryClick: (category: string) => void
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryClick }) => {
  return (
    <Box mb={{ base: '24px', md: '40px' }}>
      <Text
        fontSize={{ base: '20px', md: '24px' }}
        fontWeight="700"
        color="gray.800"
        mb={{ base: '16px', md: '20px' }}
      >
        Browse by Category
      </Text>
      <Flex
        gap={{ base: '8px', md: '12px' }}
        overflowX="auto"
        pb="8px"
        sx={{
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-track': { background: 'gray.100', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb': { background: '#FF6B35', borderRadius: '10px' }
        }}
      >
        {categories.map(category => (
          <Button
            key={category}
            onClick={() => onCategoryClick(category)}
            variant={selectedCategory === category ? 'solid' : 'outline'}
            bg={selectedCategory === category ? '#FF6B35' : 'white'}
            color={selectedCategory === category ? 'white' : 'gray.700'}
            borderColor={selectedCategory === category ? '#FF6B35' : 'gray.300'}
            borderRadius="full"
            minW={{ base: '70px', md: '90px' }}
            w={{ base: '40px', md: '50px' }}
            h={{ base: '40px', md: '50px' }}
            px={{ base: '4px', md: '6px' }}
            py={{ base: '4px', md: '6px' }}
            fontSize={{ base: '10px', md: '12px' }}
            fontWeight="600"
            whiteSpace="normal"
            overflow="hidden"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            lineHeight="1.2"
            wordBreak="break-word"
            _hover={{
              bg: selectedCategory === category ? '#E55A2B' : 'gray.50',
              borderColor: '#FF6B35'
            }}
          >
            {category}
          </Button>
        ))}
      </Flex>
    </Box>
  )
}

export default CategoryFilter
