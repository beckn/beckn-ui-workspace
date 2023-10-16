import React, { useEffect, useState } from 'react'
import { Item, ParsedItem, Provider, SearchResponse, SearchResultsProps } from './search-results.types'
import axios, { AxiosError } from 'axios'
import Loader from '../../components/loader'
import ProductList from '../../components/product-list'
import { SearchInputOnSearchResultsPage } from '../../components'
import { Box } from '@chakra-ui/react'
import { formattedItems } from './search-results.utils'

const SearchResults: React.FC<SearchResultsProps> = props => {
  const { apiUrl, searchPayload, onFailure, onSuccess, ...restProps } = props
  const [data, setData] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([])
  const [searchText, setSearchText] = useState<string>(searchPayload.message.criteria.searchString)

  const handleSearch = () => {
    setIsLoading(true)

    const clonedSearchPayload = structuredClone(searchPayload)
    clonedSearchPayload.message.criteria.searchString = searchText

    axios
      .post(`${apiUrl}/client/v2/search`, clonedSearchPayload)
      .then(res => {
        const response: SearchResponse = res.data

        setData(response)
        onSuccess(response)
        setIsLoading(false)
      })
      .catch((e: AxiosError) => {
        onFailure(e.message)
        setError(e.message)
      })
  }

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    if (data) {
      const allItems = formattedItems(data)
      setParsedItems(allItems)
    }
  }, [data])

  return (
    <>
      <Box
        height={'61px'}
        ml={'-20px'}
        mr={'-20px'}
        position={'fixed'}
        zIndex={'9'}
        background={'#fff'}
        width={'100%'}
        mt={'-20px'}
      >
        <SearchInputOnSearchResultsPage
          handleSubmit={handleSearch}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Box>
      <div>{isLoading || !parsedItems.length ? <Loader /> : <ProductList productList={parsedItems} />}</div>
    </>
  )
}

export default SearchResults
