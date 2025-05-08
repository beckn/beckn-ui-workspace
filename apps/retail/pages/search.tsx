import React, { useEffect, useRef, useState } from 'react'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { parseSearchlist, SearchAndDiscover } from '@beckn-ui/common'
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
    const searchPromises = searchKeywords.map((keyword, index) => {
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
      .catch(e => {
        setIsLoading(false)
      })
      .finally(() => {
        previousSearchTermRef.current = (searchTerm as SearchTermModel).searchKeyword
      })
  }

  useEffect(() => {
    if ((searchTerm as SearchTermModel).searchKeyword) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: (searchTerm as SearchTermModel).searchKeyword }))
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

  const handleApplyFilter = (sortBy: string) => {
    const sortedItemsCopy = [...originalItems]

    if (sortBy === 'LowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
    } else if (sortBy === 'HightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
    } else if (sortBy === 'RatingLowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.rating!) - parseFloat(b.item.rating!))
    } else if (sortBy === 'RatingHightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.rating!) - parseFloat(a.item.rating!))
    }

    dispatch(setItems(sortedItemsCopy))
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
        handleApplyFilter
      }}
      loaderProps={{
        isLoading,
        loadingText: t.pleaseWait,
        loadingSubText: t.searchLoaderSubText,
        dataTest: testIds.loadingIndicator
      }}
      catalogProps={{
        viewDetailsClickHandler: handleViewDetailsClickHandler
      }}
      noProduct={key => t.noProduct}
    />
  )
}

export default Search
