import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Container, Text, VStack, Flex, IconButton, Image, SimpleGrid } from '@chakra-ui/react'
import { FiArrowLeft } from 'react-icons/fi'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { DiscoveryRootState } from '@beckn-ui/common/lib/types'
import { useLanguage } from '@hooks/useLanguage'
import FoodItemCard from '@components/foodItemCard/FoodItemCard'
import { LoaderWithMessage } from '@beckn-ui/molecules'

const ProviderItemsPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { providerId } = router.query
  const { productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const [providerData, setProviderData] = useState<{
    name: string
    image?: string
    items: ParsedItemModel[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (providerId && typeof window !== 'undefined') {
      // Step 1: Try to get provider data from localStorage
      const storedProviderData = localStorage.getItem(`provider_${providerId}`)
      if (storedProviderData) {
        try {
          const parsed = JSON.parse(storedProviderData)
          setProviderData(parsed)
          setIsLoading(false)
          return
        } catch (error) {
          console.error('Error parsing provider data from localStorage:', error)
          // Clear corrupted data
          localStorage.removeItem(`provider_${providerId}`)
        }
      }

      // Step 2: If not in localStorage, try to find in Redux store
      if (productList && productList.length > 0) {
        // Try to match by providerId first
        let matchedItems = productList.filter(item => item.providerId === providerId)

        // If no match by providerId, try matching by providerName (slugified)
        if (matchedItems.length === 0 && providerId) {
          const providerNameFromId = (providerId as string).replace(/-/g, ' ').toLowerCase()
          matchedItems = productList.filter(item => {
            if (!item.providerName) return false
            const itemProviderName = item.providerName.toLowerCase()
            return (
              itemProviderName === providerNameFromId ||
              itemProviderName.includes(providerNameFromId) ||
              providerNameFromId.includes(itemProviderName)
            )
          })
        }

        if (matchedItems.length > 0) {
          // Reconstruct provider data from matched items
          const firstItem = matchedItems[0]
          const providerName = firstItem.providerName || 'Restaurant'
          const providerImage =
            firstItem.providerImg?.[0]?.url || firstItem.item.images?.[0]?.url || '/images/restaurant-placeholder.svg'

          const reconstructedData = {
            name: providerName,
            image: providerImage,
            items: matchedItems
          }

          // Save to localStorage for future use
          try {
            localStorage.setItem(`provider_${providerId}`, JSON.stringify(reconstructedData))
          } catch (storageError) {
            console.warn('Failed to save provider data to localStorage:', storageError)
          }

          setProviderData(reconstructedData)
          setIsLoading(false)
          return
        }
      }

      // Step 3: If still not found, show error and redirect
      setError('Provider data not found. Please search again.')
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Provider Not Found',
            display: true,
            type: 'error',
            description: 'The restaurant you are looking for is not available. Redirecting to search...'
          }
        })
      )

      // Redirect to search after showing error
      setTimeout(() => {
        router.push('/search')
      }, 2000)
      setIsLoading(false)
    }
  }, [providerId, router, productList, dispatch])

  const handleAddToCart = (item: ParsedItemModel) => {
    dispatch(cartActions.addItemToCart({ product: item, quantity: 1 }))
    dispatch(
      feedbackActions.setToastData({
        toastData: {
          message: t.addedToCart || 'Added to cart',
          display: true,
          type: 'success',
          description: t.addedToCart || 'Item added to cart successfully'
        }
      })
    )
  }

  const handleItemClick = (item: ParsedItemModel) => {
    router.push(`/product?id=${item.id}`)
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 100px)"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait || 'Please wait'}
          loadingSubText="Loading items..."
        />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 100px)"
        px="24px"
      >
        <Box
          textAlign="center"
          maxW="400px"
        >
          <Text
            fontSize="18px"
            color="gray.600"
            mb="12px"
          >
            {error}
          </Text>
          <Text
            fontSize="14px"
            color="gray.500"
          >
            Redirecting to search...
          </Text>
        </Box>
      </Box>
    )
  }

  if (!providerData) {
    return null
  }

  const DEFAULT_RESTAURANT_IMAGE = '/images/restaurant-placeholder.svg'

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '16px', md: '24px' }}
    >
      <Container
        maxW="1200px"
        px={{ base: '16px', md: '24px' }}
      >
        {/* Header */}
        <Flex
          align="center"
          mb={{ base: '20px', md: '32px' }}
        >
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft />}
            variant="ghost"
            mr="12px"
            onClick={() => router.back()}
          />
          <Flex
            align="center"
            gap="12px"
            flex="1"
          >
            <Box
              w={{ base: '60px', md: '80px' }}
              h={{ base: '60px', md: '80px' }}
              borderRadius="12px"
              overflow="hidden"
              bg="gray.100"
              flexShrink={0}
            >
              <Image
                src={providerData.image || DEFAULT_RESTAURANT_IMAGE}
                alt={providerData.name}
                w="100%"
                h="100%"
                objectFit="cover"
                fallbackSrc={DEFAULT_RESTAURANT_IMAGE}
              />
            </Box>
            <Box
              flex="1"
              minW="0"
            >
              <Text
                fontSize={{ base: '20px', md: '24px' }}
                fontWeight="700"
                color="gray.800"
                lineHeight="1.2"
                noOfLines={1}
              >
                {providerData.name}
              </Text>
              <Text
                fontSize={{ base: '14px', md: '16px' }}
                color="gray.500"
                fontWeight="400"
                mt="6px"
                lineHeight="1.4"
              >
                {providerData.items.length} {providerData.items.length === 1 ? 'item' : 'items'} available
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Items Grid */}
        {providerData.items.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: '16px', md: '24px' }}
          >
            {providerData.items.map(item => {
              const currency = item.item.price.currency || 'INR'
              const price = item.item.price.value

              return (
                <FoodItemCard
                  key={item.id}
                  id={item.id}
                  name={item.item.name}
                  description={item.item.short_desc}
                  longDesc={item.item.long_desc}
                  soldBy={item.providerName}
                  price={price}
                  currency={currency === 'INR' ? '₹' : currency}
                  image={item.item.images?.[0]?.url}
                  onAddClick={() => handleAddToCart(item)}
                  onItemClick={() => handleItemClick(item)}
                />
              )
            })}
          </SimpleGrid>
        ) : (
          <Box
            textAlign="center"
            py="60px"
          >
            <Text
              fontSize="18px"
              color="gray.500"
            >
              No items available
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default ProviderItemsPage
