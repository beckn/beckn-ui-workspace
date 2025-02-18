import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { discoveryActions, ParsedItemModel, SearchAndDiscover } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { DOMAIN, DOMAIN_PATH } from '@lib/config'
import { Product } from '@beckn-ui/becknified-components'
import { testIds } from '@shared/dataTestIds'
import { Box } from '@chakra-ui/react'
import { parseSearchlist } from '@utils/search-utils'
import { RootState } from '@store/index'
import { initDB, getFromCache, setInCache } from '@utils/indexedDB'

const Search = () => {
  const type = useSelector((state: RootState) => state.navigation.type)

  const [items, setItems] = useState<ParsedItemModel[]>([])
  const [originalItems, setOriginalItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState<string>((router.query?.searchTerm as string) || '')

  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Initialize IndexedDB when component mounts
  useEffect(() => {
    initDB().catch(console.error)
  }, [])

  const fetchDataForSearch = async () => {
    if (!searchKeyword || !type) return

    // Create cache key with type prefix
    const cacheKey =
      type === 'RENT_AND_HIRE' ? `rental_${searchKeyword.toLowerCase()}` : `retail_${searchKeyword.toLowerCase()}`

    try {
      const cachedResults = await getFromCache(cacheKey)
      if (cachedResults) {
        console.log(`Getting ${type} results from cache`)
        setItems(cachedResults)
        setOriginalItems(cachedResults)
        dispatch(discoveryActions.addProducts({ products: cachedResults }))
        return
      }
    } catch (error) {
      console.error('Cache read error:', error)
    }

    setIsLoading(true)

    try {
      const searchPayload = {
        context: {
          domain: type === 'RENT_AND_HIRE' ? 'deg:rental' : 'deg:retail'
        },
        searchString: searchKeyword
      }

      const res = await axios.post(`${apiUrl}/search`, searchPayload)
      dispatch(discoveryActions.addTransactionId({ transactionId: res.data.data[0].context.transaction_id }))
      const parsedSearchItems = parseSearchlist(res.data.data)
      dispatch(discoveryActions.addProducts({ products: parsedSearchItems }))

      // Cache the results with type-specific prefix
      await setInCache(cacheKey, parsedSearchItems)

      setItems(parsedSearchItems)
      setOriginalItems(parsedSearchItems)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchKeyword) {
      localStorage.setItem('optionTags', JSON.stringify({ name: searchKeyword }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
  }, [searchKeyword])

  const handleFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setItems(originalItems)
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

    setItems(sortedItemsCopy)
    setIsFilterOpen(false)
  }

  const handleViewDetailsClickHandler = (selectedItem: ParsedItemModel, product: Product) => {
    const { item } = selectedItem
    dispatch(discoveryActions.addSingleProduct({ product: selectedItem }))
    router.push({
      pathname: '/product',
      query: {
        id: item.id,
        search: searchKeyword
      }
    })
    localStorage.setItem('selectCardHeaderText', JSON.stringify(product.name))
  }

  return (
    <Box className="myStore-search-wrapper search-text">
      <SearchAndDiscover
        items={items}
        searchProps={{
          searchKeyword: searchKeyword as string,
          setSearchKeyword,
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
          loadingText: 'Please wait!',
          loadingSubText: 'While we fetch catalogues from UEI',
          dataTest: testIds.loadingIndicator,
          image: './images/loder-img.svg'
        }}
        catalogProps={{
          viewDetailsClickHandler: handleViewDetailsClickHandler
        }}
        noProduct={key => t.noProduct}
      />
    </Box>
  )
}

export default Search
