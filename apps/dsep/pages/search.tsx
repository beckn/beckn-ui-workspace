import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import SearchBar from '../components/header/SearchBar'
import ProductList from '../components/productList/ProductList'
import { useLanguage } from '../hooks/useLanguage'
import { useRouter } from 'next/router'
import { getParsedSearchlist } from '../utilities/search-utils'
import { ParsedItemModel, SearchResponseModel } from '../types/search.types'
import axios from '../services/axios'
import { testIds } from '@shared/dataTestIds'

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const searchPayload = {
    context: {
      domain: 'dsep:courses'
    },
    searchString: searchKeyword
  }

  const fetchDataForSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${apiUrl}/search`, searchPayload)
      const parsedItems = getParsedSearchlist(response.data.data as SearchResponseModel[])
      localStorage.setItem('searchItems', JSON.stringify(parsedItems))
      setItems(parsedItems)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      if (localStorage && !localStorage.getItem('searchItems')) {
        await fetchDataForSearch()
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults: ParsedItemModel[] = JSON.parse(cachedSearchResults)
        setItems(parsedCachedResults)
      }
    }
  }, [])

  useEffect(() => {
    if (searchKeyword !== router.query?.searchTerm) {
      fetchDataForSearch()
    }
  }, [searchKeyword])

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
        <SearchBar
          searchString={searchKeyword}
          handleChange={(text: string) => {
            setSearchKeyword(text)
            localStorage.removeItem('optionTags')
            localStorage.setItem(
              'optionTags',
              JSON.stringify({
                name: text
              })
            )
            window.dispatchEvent(new Event('storage-optiontags'))
          }}
        />
      </Box>

      {loading ? (
        <Box
          display={'grid'}
          height={'calc(100vh - 300px)'}
          alignContent={'center'}
          data-test={testIds.loadingIndicator}
        >
          <LoaderWithMessage
            loadingText={t.catalogLoader}
            loadingSubText={t.coursesCatalogLoader}
          />
        </Box>
      ) : (
        <ProductList productList={items} />
      )}
    </>
  )
}

export default Search
