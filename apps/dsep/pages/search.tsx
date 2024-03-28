import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import SearchBar from '../components/header/SearchBar'
import ProductList from '../components/productList/ProductList'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import { RetailItem } from '../lib/types/products'
import Loader from '../components/loader/Loader'
import { useLanguage } from '../hooks/useLanguage'
import { useRouter } from 'next/router'
import { getParsedSearchlist } from '../utilities/search-utils'
import { ParsedItemModel, SearchResponseModel } from '../types/search.types'
import CustomToast from '../components/customToast/custom-toast'

//Mock data for testing search API. Will remove after the resolution of CORS issue

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
    message: {
      criteria: {
        dropLocation: '12.9715987,77.5945627',
        categoryName: 'Courses',
        searchString: searchKeyword
      }
    }
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
      <div>
        {loading ? (
          <div>
            <Loader
              stylesForLoadingText={{
                fontWeight: '600',
                fontSize: '16px'
              }}
              subLoadingText={t.coursesCatalogLoader}
              loadingText={t.catalogLoader}
            />
          </div>
        ) : (
          <ProductList productList={items} />
        )}
      </div>
    </>
  )
}

export default Search
