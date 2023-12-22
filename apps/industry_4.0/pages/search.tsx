import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Loader } from '@beckn-ui/molecules'
import { parsedSearchlist } from '@utils/search-results.utils'
import { ProductCard } from '@beckn-ui/becknified-components'
import ProductCardRenderer from '@components/productCard/product-card-renderer'
import SearchBar from '../components/header/SearchBar'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '../types/search.types'
import TopSheet from '@components/topSheet/TopSheet'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const searchPayload = {
    context: {
      domain: 'supply-chain-services:assembly'
    },
    category: {
      categoryName: searchKeyword
    },
    location: '12.423423,77.325647'
  }

  const fetchDataForSearch = () => {
    setIsLoading(true)
    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        const parsedSearchItems = parsedSearchlist(res.data.data)
        localStorage.setItem('searchItems', JSON.stringify(parsedSearchItems))
        setItems(parsedSearchItems)
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (searchKeyword) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: searchKeyword }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword])

  useEffect(() => {
    if (localStorage) {
      const cachedSearchResults = localStorage.getItem('searchItems')
      if (cachedSearchResults) {
        const parsedCachedResults = JSON.parse(cachedSearchResults)
        setItems(parsedCachedResults)
      }
    }
  }, [])

  return (
    <>
      <Box>
        <TopSheet currentAddress={router.query?.currentAddress} />
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
      <Box>
        {isLoading ? (
          <Box
            display={'grid'}
            height={'calc(100vh - 300px)'}
            alignContent={'center'}
          >
            <Loader>
              <Box
                mt={'13px'}
                display={'flex'}
                flexDir={'column'}
                alignItems={'center'}
              >
                <Text
                  fontWeight={600}
                  fontSize={'17px'}
                >
                  {t.catalogLoader}
                </Text>
                <Text
                  fontWeight={400}
                  fontSize={'15px'}
                >
                  {t.catalogSubLoader}
                </Text>
              </Box>
            </Loader>
          </Box>
        ) : (
          <>
            {items.map((item, idx) => {
              return (
                <ProductCard
                  key={idx}
                  ComponentRenderer={ProductCardRenderer}
                  dataSource={item}
                />
              )
            })}
          </>
        )}
      </Box>
    </>
  )
}

export default Search
