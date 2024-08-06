import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { discoveryActions } from '@beckn-ui/common/src/store'
import { useBreakpoint } from '@chakra-ui/react'
import { useLanguage } from '../hooks/useLanguage'
import { parseSearchlist, SearchAndDiscover } from '@beckn-ui/common'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import { DOMAIN } from '@lib/config'
import { Product } from '@beckn-ui/becknified-components'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const [originalItems, setOriginalItems] = useState<ParsedItemModel[]>([])
  const [sortBy, setSortBy] = useState<string>('')
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const selectedCategory = router.query?.selectedItem
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const searchPayload = {
    context: {
      domain: DOMAIN
    },
    searchString: searchKeyword,
    category: {
      name: selectedCategory
    }
  }

  const fetchDataForSearch = () => {
    if (!searchKeyword && !selectedCategory) return
    setIsLoading(true)
    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        dispatch(discoveryActions.addTransactionId({ transactionId: res.data.data[0].context.transaction_id }))
        const parsedSearchItems = parseSearchlist(res.data.data)
        dispatch(discoveryActions.addProducts({ products: parsedSearchItems }))
        setItems(parsedSearchItems)
        setOriginalItems(parsedSearchItems)
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    // if (searchKeyword) {
    if (searchKeyword || selectedCategory) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: searchKeyword }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, selectedCategory])

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults = JSON.parse(cachedSearchResults)
        setItems(parsedCachedResults)
      }
    }
  }, [])

  const handleApplyFilter = (sortBy: string) => {
    setSortBy(sortBy)

    const sortedItemsCopy = [...originalItems]

    if (sortBy === 'LowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
    } else if (sortBy === 'HightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
    } else if (sortBy === 'RatingLowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.rating) - parseFloat(b.item.rating))
    } else if (sortBy === 'RatingHightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.rating) - parseFloat(a.item.rating))
    }

    setItems(sortedItemsCopy)
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setItems(originalItems)
  }
  const handleFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen)
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
    <SearchAndDiscover
      items={items}
      searchProps={{
        searchKeyword: searchKeyword as string,
        selectedCategory: selectedCategory as string,
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
        loadingText: t.loadingText,
        loadingSubText: t.loadingSubText
      }}
      catalogProps={{
        viewDetailsClickHandler: handleViewDetailsClickHandler
      }}
      noProduct={key => t.noProduct}
    />
  )
}

export default Search
