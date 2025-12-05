import React, { useEffect, useRef, useState } from 'react'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { parseSearchlist, SearchAndDiscover, setLocalStorage } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import { discoveryActions } from '@beckn-ui/common/src/store/discovery-slice'
import { DOMAIN } from '@lib/config'
import { Product } from '@beckn-ui/becknified-components'
import { testIds } from '@shared/dataTestIds'
import { RootState } from '@store/index'
import { SearchTermModel, setItems, setOriginalItems, setSearchTerm } from '@beckn-ui/common/src/store/search-slice'

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

    // Split search keyword by comma and trim each keyword
    const searchKeywords = (searchTerm as SearchTermModel).searchKeyword.split(',').map(keyword => keyword.trim())

    // Create search payloads with different combinations
    const searchPromises = searchKeywords.map(keyword => {
      const searchString = keyword

      const searchPayload = {
        context: {
          domain: DOMAIN
        },
        searchString: searchString,
        category: {
          categoryCode: (searchTerm as SearchTermModel).category || 'Retail'
        },
        fulfillment: {
          type: 'Delivery',
          stops: [
            {
              location: '28.4594965,77.0266383'
            }
          ]
        }
      }

      return axios.post(`${apiUrl}/search`, searchPayload)
    })

    Promise.all(searchPromises)
      .then(responses => {
        // Process each response and extract items
        const allResults = responses
          .filter(res => res?.data?.data?.[0]?.message?.providers)
          .map(res => res.data.data[0]) // Keep the original response structure

        console.log('allResults', allResults)

        // Get transaction ID from first valid response
        const firstValidResponse = responses.find(res => res?.data?.data?.[0]?.context?.transaction_id)
        if (firstValidResponse) {
          dispatch(
            discoveryActions.addTransactionId({
              transactionId: firstValidResponse.data.data[0].context.transaction_id
            })
          )
        }

        // Parse and combine all search items
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

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults = JSON.parse(cachedSearchResults)
        dispatch(setItems(parsedCachedResults))
      }
    }
  }, [])

  const handleFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    dispatch(setItems(originalItems))
  }

  const handleApplyFilter = (filters: Record<string, string>) => {
    let filteredItems = [...originalItems]

    // Apply search/sort by
    if (filters.searchBy) {
      switch (filters.searchBy) {
        case 'priceHighToLow':
          filteredItems.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
          break
        case 'priceLowToHigh':
          filteredItems.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
          break
        case 'newest':
          // Sort by created timestamp if available in tags
          filteredItems.sort((a, b) => {
            const aTimestamp = a.item.tags?.find(t => t.code === 'created_at')?.list?.[0]?.value || '0'
            const bTimestamp = b.item.tags?.find(t => t.code === 'created_at')?.list?.[0]?.value || '0'
            return parseInt(bTimestamp) - parseInt(aTimestamp)
          })
          break
        // For 'relevance', we keep the original order
        default:
          break
      }
    }
    console.log('filters', filters)
    // Apply service type filter
    if (filters.serviceType && filters.serviceType !== '') {
      filteredItems = filteredItems.filter(item => item.item.fulfillments?.some(f => f.type === filters.serviceType))
    }

    // Apply rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      filteredItems = filteredItems.filter(item => parseFloat(item.item.rating || '0') >= minRating)
    }

    // Apply deals filter
    if (filters.deals && filters.deals !== 'all') {
      filteredItems = filteredItems.filter(item => {
        const discountTag = item.item.tags?.find(t => t.code === 'discount')
        const discountValue = discountTag?.list?.[0]?.value
        const hasDiscount = discountValue ? parseFloat(discountValue) > 0 : false
        return filters.deals === 'deals' ? hasDiscount : !hasDiscount
      })
    }
    console.log('filteredItems', filteredItems)
    dispatch(setItems(filteredItems))
    setIsFilterOpen(false)
  }

  const handleViewDetailsClickHandler = (selectedItem: ParsedItemModel, product: Product) => {
    const { item } = selectedItem
    dispatch(discoveryActions.addSingleProduct({ product: selectedItem }))
    router.push({
      pathname: '/product',
      query: {
        id: item.id,
        search: (searchTerm as SearchTermModel).searchKeyword
      }
    })
    localStorage.setItem('selectCardHeaderText', JSON.stringify(product.name))
  }

  return (
    <SearchAndDiscover
      items={items}
      searchProps={{
        searchKeyword: (searchTerm as SearchTermModel).searchKeyword,
        setSearchKeyword: (term: string) => dispatch(setSearchTerm({ searchKeyword: term })),
        fetchDataOnSearch: fetchDataForSearch
      }}
      filterProps={{
        isFilterOpen: isFilterOpen,
        handleFilterOpen,
        handleFilterClose,
        handleResetFilter,
        handleApplyFilter,
        fields: [
          {
            name: 'searchBy',
            label: 'Search by',
            type: 'dropdown',
            defaultValue: 'relevance',
            options: [
              {
                value: 'relevance',
                label: 'Relevance'
              },
              {
                value: 'priceHighToLow',
                label: 'Price: High to Low'
              },
              {
                value: 'priceLowToHigh',
                label: 'Price: Low to High'
              },
              {
                value: 'newest',
                label: 'Newest First'
              }
            ]
          },
          {
            name: 'serviceType',
            label: 'Service Type',
            type: 'dropdown',
            defaultValue: '',
            options: [
              {
                value: '',
                label: 'Select'
              },
              {
                value: 'delivery',
                label: 'Delivery'
              },
              {
                value: 'pickup',
                label: 'Pickup'
              },
              {
                value: 'dineIn',
                label: 'Dine In'
              }
            ]
          },
          {
            name: 'rating',
            label: 'Rating',
            type: 'dropdown',
            defaultValue: '',
            options: [
              {
                value: '',
                label: 'Select'
              },
              {
                value: '4+',
                label: '4+'
              },
              {
                value: '3+',
                label: '3+'
              },
              {
                value: '2+',
                label: '2+'
              },
              {
                value: '1+',
                label: '1+'
              }
            ]
          },
          {
            name: 'deals',
            label: 'Deals & Discounts',
            type: 'dropdown',
            defaultValue: '',
            options: [
              {
                value: '',
                label: 'Select'
              },
              {
                value: 'all',
                label: 'All prices'
              },
              {
                value: 'deals',
                label: 'With Deals'
              },
              {
                value: 'noDeals',
                label: 'Without Deals'
              }
            ]
          }
        ]
      }}
      loaderProps={{
        isLoading,
        loadingText: t.pleaseWait,
        loadingSubText: t.searchLoaderSubText + ' ' + (searchTerm as SearchTermModel).searchKeyword + '.',
        dataTest: testIds.loadingIndicator
      }}
      catalogProps={{
        viewDetailsClickHandler: handleViewDetailsClickHandler
      }}
      noProduct={() => t.noProduct}
    />
  )
}

export default Search
