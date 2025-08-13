import React, { useEffect, useState } from 'react'
import axios from '../services/axios'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { parsedSearchlist } from '@utils/search-results.utils'
import { ProductCard } from '@beckn-ui/becknified-components'
import ProductCardRenderer from '@components/productCard/product-card-renderer'
import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '../types/search.types'
import TopSheet from '@components/topSheet/TopSheet'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { testIds } from '@shared/dataTestIds'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [isLoading, setIsLoading] = useState(false)

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
      .catch(() => {
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

  const currentAddress = router.query?.currentAddress

  return (
    <>
      <TopSheet currentAddress={currentAddress as string} />
      <Box
        marginTop={'80px'}
        className="hideScroll"
        maxH="calc(100vh - 130px)"
      >
        <Box>
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
        <Box>
          {isLoading ? (
            <Box
              display={'grid'}
              height={'calc(100vh - 300px)'}
              alignContent={'center'}
              data-test={testIds.loadingIndicator}
            >
              <LoaderWithMessage
                loadingText={t.pleaseWait}
                loadingSubText={t.searchLoaderSubText}
              />
            </Box>
          ) : (
            <>
              {items.length > 0 ? (
                items.map((item, idx) => {
                  return (
                    <ProductCard
                      key={idx}
                      ComponentRenderer={ProductCardRenderer}
                      dataSource={item}
                    />
                  )
                })
              ) : (
                <Box
                  pt={8}
                  opacity={0.5}
                  textAlign="center"
                  data-test={testIds.noDataAvailable}
                >
                  {t.noProduct}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

export default Search
