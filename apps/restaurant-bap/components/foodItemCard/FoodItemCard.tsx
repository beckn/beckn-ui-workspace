import React from 'react'
import { Box, Flex, Text, Image, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { formatCurrency } from '@beckn-ui/becknified-components/src/components/product-price/product-price'
import { CurrencyType } from '@beckn-ui/becknified-components/src/components/product-price/ProductPrice.types'

interface FoodItemCardProps {
  id: string
  name: string
  description?: string
  longDesc?: string
  soldBy?: string
  price: string
  currency?: string
  image?: string
  onAddClick: (id: string) => void
  onItemClick?: (id: string) => void
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  id,
  name,
  description,
  longDesc,
  soldBy,
  price,
  currency = '₹',
  image,
  onAddClick,
  onItemClick
}) => {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      p="16px"
      display="flex"
      gap="16px"
      boxShadow="0 1px 4px rgba(0,0,0,0.08)"
      cursor="pointer"
      transition="all 0.2s"
      className="food-item-card"
      onClick={() => onItemClick?.(id)}
    >
      <Box
        width="110px"
        height="110px"
        minWidth="110px"
        borderRadius="10px"
        overflow="hidden"
        bg="gray.100"
        flexShrink={0}
      >
        <Image
          src={image || '/images/food-placeholder.svg'}
          alt={name}
          width="100%"
          height="100%"
          objectFit="cover"
          fallbackSrc="/images/food-placeholder.svg"
        />
      </Box>
      <Flex
        flex="1"
        direction="column"
        justifyContent="space-between"
        minWidth="0"
      >
        <Box>
          <Text
            fontSize="17px"
            fontWeight="700"
            color="gray.800"
            mb="4px"
            noOfLines={1}
          >
            {name}
          </Text>
          {soldBy && (
            <Text
              fontSize="12px"
              color="gray.500"
              mb="6px"
              noOfLines={1}
            >
              Sold by: {soldBy}
            </Text>
          )}
          {(longDesc || description) && (
            <Text
              fontSize="13px"
              color="gray.600"
              mb="10px"
              noOfLines={2}
              lineHeight="1.4"
            >
              {longDesc || description}
            </Text>
          )}
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize="14px"
            fontWeight="500"
            color="gray.800"
          >
            {(() => {
              const currencyType = (currency === '₹' || currency === 'INR' ? 'INR' : currency) as CurrencyType
              const priceNum = parseFloat(price)
              return formatCurrency(priceNum, currencyType)
            })()}
          </Text>
          <Button
            size="sm"
            bg="#FF6B35"
            color="white"
            borderRadius="24px"
            px="20px"
            py="8px"
            fontSize="13px"
            fontWeight="700"
            _hover={{
              bg: '#E55A2B'
            }}
            _active={{
              bg: '#CC4F24'
            }}
            onClick={e => {
              e.stopPropagation()
              onAddClick(id)
            }}
            leftIcon={<AddIcon boxSize="14px" />}
          >
            ADD
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default FoodItemCard
