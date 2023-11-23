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

const Search = () => {
  const [items, setItems] = useState<RetailItem[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [selectedCategory, setSelectedCategory] = useState(router.query?.selectedItem || '')
  const dispatch = useDispatch()
  const [providerId, setProviderId] = useState('')
  const { t, locale } = useLanguage()
  const [tagValue, setTagValue] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const { data, loading, error, fetchData } = useRequest()

  useEffect(() => {
    if (!!searchKeyword) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: searchKeyword }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
    if (localStorage) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword])

  const searchPayload = {
    name: searchKeyword,
    category: {
      name: selectedCategory
    }
  }
  const fetchDataForSearch = () => fetchData(`${apiUrl}/search`, 'POST', searchPayload)

  useEffect(() => {
    if (localStorage && !localStorage.getItem('searchItems')) {
      if (providerId) {
        fetchData(`${apiUrl}/search`, 'POST', searchPayload)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId])

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
    if (data && data.length > 0) {
      const allItems = data.flatMap(dataObject => {
        dispatch(responseDataActions.addTransactionId(dataObject.context.transactionId))

        return dataObject.scholarshipProviders.flatMap(provider => {
          return provider.items.map(item => {
            return {
              bpp_id: dataObject.context.bppId,
              bpp_uri: dataObject.context.bppUri,
              ...item,
              providerId: provider.id,
              locations: provider.locations,
              bppName: provider.name
            }
          })
        })
      })

      localStorage.setItem('searchItems', JSON.stringify(allItems))
      setItems(allItems)
      console.log(allItems)
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
        <SearchBar
          searchString={searchKeyword}
          handleChange={(text: string) => {
            setSearchKeyword(text)
            localStorage.removeItem('optionTags')
            localStorage.setItem('optionTags', JSON.stringify({ name: text }))
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
