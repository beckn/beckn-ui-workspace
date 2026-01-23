import React, { useEffect, useRef, useState, useMemo } from 'react'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Container, Text } from '@chakra-ui/react'
import { parseSearchlist, setLocalStorage } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import { discoveryActions } from '@beckn-ui/common/src/store/discovery-slice'
import { DOMAIN } from '@lib/config'
import { RootState } from '@store/index'
import { SearchTermModel, setItems, setOriginalItems } from '@beckn-ui/common/src/store/search-slice'
import SearchBar from '@beckn-ui/common/src/components/searchBar'
import Filter from '@beckn-ui/common/src/components/filter'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import RestaurantSection from '@components/restaurantSection/RestaurantSection'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'

const Search = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { items, originalItems, searchTerm } = useSelector((state: RootState) => state.search)
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const previousSearchTermRef = useRef((searchTerm as SearchTermModel).searchKeyword)

  const fetchDataForSearch = () => {
    if (!(searchTerm as SearchTermModel).searchKeyword) return

    setIsLoading(true)
    if (
      previousSearchTermRef.current === (searchTerm as SearchTermModel).searchKeyword &&
      originalItems &&
      originalItems.length > 0
    ) {
      dispatch(setItems(originalItems))
      dispatch(setOriginalItems(originalItems))
      setIsLoading(false)
      return
    }

    const searchKeywords = (searchTerm as SearchTermModel).searchKeyword.split(',').map(keyword => keyword.trim())
    const searchPromises = searchKeywords.map(keyword => {
      const searchPayload = {
        context: { domain: DOMAIN },
        searchString: keyword,
        category: { categoryCode: 'Food' },
        fulfillment: {
          type: 'Delivery',
          stops: [{ location: '28.4594965,77.0266383' }]
        }
      }
      return axios.post(`${apiUrl}/search`, searchPayload)
    })

    Promise.all(searchPromises)
      .then(responses => {
        const allResults = responses
          .filter(res => res?.data?.data?.[0]?.message?.providers)
          .map(res => res.data.data[0])

        const firstValidResponse = responses.find(res => res?.data?.data?.[0]?.context?.transaction_id)
        if (firstValidResponse) {
          dispatch(
            discoveryActions.addTransactionId({
              transactionId: firstValidResponse.data.data[0].context.transaction_id
            })
          )
        }

        const parsedSearchItems = parseSearchlist(allResults)
        dispatch(discoveryActions.addProducts({ products: parsedSearchItems }))
        dispatch(setItems(parsedSearchItems))
        dispatch(setOriginalItems(parsedSearchItems))
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
      .finally(() => {
        previousSearchTermRef.current = (searchTerm as SearchTermModel).searchKeyword
      })
  }

  useEffect(() => {
    if ((searchTerm as SearchTermModel).searchKeyword) {
      localStorage.removeItem('searchItems')
      setLocalStorage('optionTags', { name: (searchTerm as SearchTermModel).searchKeyword })
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
  }, [searchTerm])

  const handleFilterOpen = () => setIsFilterOpen(!isFilterOpen)
  const handleFilterClose = () => setIsFilterOpen(false)
  const handleResetFilter = () => dispatch(setItems(originalItems))

  const handleApplyFilter = (filters: Record<string, string>) => {
    let filteredItems = [...originalItems]

    if (filters.searchBy) {
      switch (filters.searchBy) {
        case 'priceHighToLow':
          filteredItems.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
          break
        case 'priceLowToHigh':
          filteredItems.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
          break
        case 'newest':
          filteredItems.sort((a, b) => {
            const aTimestamp = a.item.tags?.find(t => t.code === 'created_at')?.list?.[0]?.value || '0'
            const bTimestamp = b.item.tags?.find(t => t.code === 'created_at')?.list?.[0]?.value || '0'
            return parseInt(bTimestamp) - parseInt(aTimestamp)
          })
          break
      }
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      filteredItems = filteredItems.filter(item => parseFloat(item.item.rating || '0') >= minRating)
    }

    if (filters.deals && filters.deals !== 'all') {
      filteredItems = filteredItems.filter(item => {
        const discountTag = item.item.tags?.find(t => t.code === 'discount')
        const discountValue = discountTag?.list?.[0]?.value
        const hasDiscount = discountValue ? parseFloat(discountValue) > 0 : false
        return filters.deals === 'deals' ? hasDiscount : !hasDiscount
      })
    }

    dispatch(setItems(filteredItems))
    setIsFilterOpen(false)
  }

  const handleViewDetailsClickHandler = (selectedItem: ParsedItemModel) => {
    const { item } = selectedItem
    dispatch(discoveryActions.addSingleProduct({ product: selectedItem }))
    router.push({
      pathname: '/product',
      query: {
        id: item.id,
        search: (searchTerm as SearchTermModel).searchKeyword
      }
    })
    localStorage.setItem('selectCardHeaderText', JSON.stringify(item.name))
  }

  const handleAddToCart = (item: ParsedItemModel) => {
    dispatch(cartActions.addItemToCart({ product: item, quantity: 1 }))
    dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
      })
    )
  }

  const groupedByRestaurant = useMemo(() => {
    const grouped: Record<string, ParsedItemModel[]> = {}

    items.forEach(item => {
      const restaurantId = item.providerId || item.providerName || 'unknown'
      if (!grouped[restaurantId]) {
        grouped[restaurantId] = []
      }
      grouped[restaurantId].push(item)
    })

    return Object.entries(grouped).map(([restaurantId, restaurantItems]) => {
      const firstItem = restaurantItems[0]
      const deliveryTimeTag = firstItem.item.tags?.find(t => t.code === 'delivery_time')
      const cuisineTag = firstItem.item.tags?.find(t => t.code === 'cuisine')
      const discountTag = firstItem.item.tags?.find(t => t.code === 'discount')

      return {
        restaurant: {
          id: restaurantId,
          name: firstItem.providerName || 'Restaurant',
          image: firstItem.providerImg?.[0]?.url || firstItem.item.images?.[0]?.url,
          rating: firstItem.rating || firstItem.item.rating || '4.0',
          deliveryTime: deliveryTimeTag?.list?.[0]?.value || '30-40 min',
          cuisine: cuisineTag?.list?.[0]?.value || 'Fast Food',
          offer: discountTag?.list?.[0]?.value ? `${discountTag.list[0].value}% OFF` : undefined
        },
        items: restaurantItems
      }
    })
  }, [items])

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 200px)"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.searchLoaderSubText}
        />
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
    >
      <Container
        maxW="1200px"
        py="24px"
        px={['16px', '24px']}
      >
        <Box mb="24px">
          <SearchBar
            searchString={(searchTerm as SearchTermModel).searchKeyword || ''}
            handleChange={(value: string) => {
              dispatch(setSearchTerm({ searchKeyword: value }))
              setTimeout(() => {
                if (value) fetchDataForSearch()
              }, 300)
            }}
            placeholder={t.searchPlaceholder || 'Search for food, restaurants...'}
          />
        </Box>

        <Box
          mb="20px"
          display="flex"
          justifyContent="flex-end"
        >
          <Filter
            isFilterOpen={isFilterOpen}
            handleFilterOpen={handleFilterOpen}
            handleFilterClose={handleFilterClose}
            handleResetFilter={handleResetFilter}
            handleApplyFilter={handleApplyFilter}
            fields={[
              {
                name: 'searchBy',
                label: 'Sort By',
                type: 'dropdown',
                defaultValue: 'relevance',
                options: [
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'priceHighToLow', label: 'Price: High to Low' },
                  { value: 'priceLowToHigh', label: 'Price: Low to High' },
                  { value: 'newest', label: 'Newest First' }
                ]
              },
              {
                name: 'rating',
                label: 'Rating',
                type: 'dropdown',
                defaultValue: '',
                options: [
                  { value: '', label: 'Select' },
                  { value: '4+', label: '4+' },
                  { value: '3+', label: '3+' },
                  { value: '2+', label: '2+' },
                  { value: '1+', label: '1+' }
                ]
              },
              {
                name: 'deals',
                label: 'Deals & Discounts',
                type: 'dropdown',
                defaultValue: '',
                options: [
                  { value: '', label: 'Select' },
                  { value: 'all', label: 'All prices' },
                  { value: 'deals', label: 'With Deals' },
                  { value: 'noDeals', label: 'Without Deals' }
                ]
              }
            ]}
          />
        </Box>

        {groupedByRestaurant.length === 0 ? (
          <Box
            textAlign="center"
            py="60px"
          >
            <Text
              fontSize="18px"
              color="gray.600"
            >
              {t.noProduct || 'No restaurants found'}
            </Text>
          </Box>
        ) : (
          <Box>
            {groupedByRestaurant.map((section, idx) => (
              <RestaurantSection
                key={section.restaurant.id || idx}
                restaurant={section.restaurant}
                items={section.items}
                onItemClick={handleViewDetailsClickHandler}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Search
