import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { parseSearchlist, SearchAndDiscover } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import { discoveryActions } from '@beckn-ui/common/src/store/discovery-slice'
import { DOMAIN } from '@lib/config'
import { Product } from '@beckn-ui/becknified-components'
import { testIds } from '@shared/dataTestIds'

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const [originalItems, setOriginalItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState<string>((router.query?.searchTerm as string) || '')
  const searchByLocationPathname = typeof window !== 'undefined' ? localStorage.getItem('routerPathname') : null
  const homePagePathname = typeof window !== 'undefined' ? localStorage.getItem('homePagePathname') : null
  const [providerId, setProviderId] = useState('')
  const [tagValue, setTagValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const searchPayload = {
    context: {
      domain: DOMAIN
    },
    fulfillment: {
      type: 'Delivery',
      stops: [{ location: '28.4594965,77.0266383' }]
    },
    ...(searchByLocationPathname
      ? { provider: { providerId: providerId } }
      : homePagePathname
        ? { searchString: searchKeyword }
        : { searchString: searchKeyword })
  }

  const fetchDataForSearch = () => {
    if (!searchKeyword && !providerId) return
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
    if (searchKeyword || providerId) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: searchKeyword, providerId }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
  }, [searchKeyword, providerId])

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults = JSON.parse(cachedSearchResults)
        setItems(parsedCachedResults)
      }
      const stringifiedOptiontags = localStorage.getItem('optionTags')
      const stringifiedSelectedOption = localStorage.getItem('selectedOption')
      if (stringifiedOptiontags) {
        const providerId = JSON.parse(stringifiedOptiontags).providerId
        setProviderId(providerId)
      }
      if (stringifiedSelectedOption) {
        setTagValue(JSON.parse(stringifiedSelectedOption).tagValue)
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
