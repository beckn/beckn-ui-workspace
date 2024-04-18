import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import SearchBar from '../components/header/SearchBar'
import ProductList from '../components/productList/ProductList'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import { useLanguage } from '../hooks/useLanguage'
import { useRouter } from 'next/router'
import { getParsedSearchlist } from '../utilities/search-utils'
import { ParsedItemModel, SearchResponseModel } from '../types/search.types'

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const { data, loading, error, fetchData } = useRequest()

  const searchPayload = {
    context: {
      domain: 'dsep:courses'
    },
    searchString: searchKeyword
  }

  const fetchDataForSearch = () => fetchData(`${apiUrl}/search`, 'POST', searchPayload)

  useEffect(() => {
    if (localStorage && !localStorage.getItem('searchItems')) {
      fetchData(`${apiUrl}/search`, 'POST', searchPayload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults = JSON.parse(cachedSearchResults)
        setItems(parsedCachedResults)
      }
    }
  }, [])
  useEffect(() => {
    if (data) {
      const parsedItems = getParsedSearchlist(data.data as SearchResponseModel[])
      dispatch(responseDataActions.addTransactionId(data.data[0].context.transaction_id))

      localStorage.setItem('searchItems', JSON.stringify(parsedItems))
      setItems(parsedItems)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (error) {
    return <></>
  }

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
            fetchDataForSearch()
          }}
        />
      </Box>

      {loading ? (
        <Box
          display={'grid'}
          height={'calc(100vh - 300px)'}
          alignContent={'center'}
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
