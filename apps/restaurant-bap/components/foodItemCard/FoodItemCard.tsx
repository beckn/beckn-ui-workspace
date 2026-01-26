import React, { useState } from 'react'
import { Box, Flex, Text, Image, Button, IconButton, Spinner } from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { FiCheck } from 'react-icons/fi'
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
  cartQuantity?: number
  onIncreaseQuantity?: (id: string) => void
  onDecreaseQuantity?: (id: string) => void
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
  onItemClick,
  cartQuantity = 0,
  onIncreaseQuantity,
  onDecreaseQuantity
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAdding) return

    setIsAdding(true)
    onAddClick(id)

    // Show success feedback
    setShowSuccess(true)
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 1000)
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    onIncreaseQuantity?.(id)
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDecreaseQuantity?.(id)
  }

  const isInCart = cartQuantity > 0
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

          {isInCart ? (
            <Flex
              alignItems="center"
              gap="4px"
              bg="white"
              border="1px solid #FF6B35"
              borderRadius="20px"
              px="4px"
              py="2px"
            >
              <IconButton
                aria-label="Decrease quantity"
                icon={<MinusIcon />}
                size="xs"
                bg="transparent"
                color="#FF6B35"
                _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                _active={{ bg: 'rgba(255,255,255,0.3)' }}
                onClick={handleDecrease}
                minW="20px"
                h="20px"
                borderRadius="full"
                margin="0"
              />
              <Text
                fontSize="12px"
                fontWeight="700"
                color="#FF6B35"
                minW="20px"
                textAlign="center"
              >
                {cartQuantity}
              </Text>
              <IconButton
                aria-label="Increase quantity"
                icon={<AddIcon />}
                size="xs"
                bg="transparent"
                color="#FF6B35"
                _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                _active={{ bg: 'rgba(255,255,255,0.3)' }}
                onClick={handleIncrease}
                minW="20px"
                h="20px"
                borderRadius="full"
                margin="0"
              />
            </Flex>
          ) : (
            <Button
              size="xs"
              bg={showSuccess ? '#4CAF50' : '#FF6B35'}
              color="white"
              borderRadius="20px"
              px="12px"
              py="4px"
              fontSize="11px"
              fontWeight="700"
              minW="60px"
              h="28px"
              margin="0"
              _hover={{
                bg: showSuccess ? '#45A049' : '#E55A2B'
              }}
              _active={{
                bg: showSuccess ? '#3D8B40' : '#CC4F24'
              }}
              onClick={handleAddClick}
              leftIcon={
                isAdding ? (
                  <Spinner
                    size="xs"
                    color="white"
                    w="10px"
                    h="10px"
                  />
                ) : showSuccess ? (
                  <FiCheck size="10px" />
                ) : (
                  <AddIcon boxSize="10px" />
                )
              }
              disabled={isAdding}
              transition="all 0.3s ease"
              transform={showSuccess ? 'scale(1.05)' : 'scale(1)'}
            >
              {showSuccess ? 'ADDED' : isAdding ? 'ADDING...' : 'ADD'}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default FoodItemCard
