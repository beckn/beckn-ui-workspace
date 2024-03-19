import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Box, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { parsedSearchlist } from '@utils/search-results.utils'
import { ProductCard } from '@beckn-ui/becknified-components'
import { BottomModal } from '@beckn-ui/molecules'
import { useBreakpoint } from '@chakra-ui/react'
import ProductCardRenderer from '@components/productCard/product-card-renderer'
import SearchBar from '../components/header/SearchBar'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '../types/search.types'
import TopSheet from '@components/topSheet/TopSheet'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import Filter from '../components/filter/Filter'
import FilterIcon from '../public/images/filter-icon.svg'
import { BsFilterSquare } from 'react-icons/bs'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const isSmallScreen = mobileBreakpoints.includes(breakpoint)
  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const searchPayload = {
    context: {
      domain: 'retail'
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
      <Box display="flex">
        {!isSmallScreen && <Filter />}
        <Box>
          <Box
            display="flex"
            alignItems="center"
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
            {isSmallScreen && (
              <Image
                onClick={() => setIsFilterOpen(true)}
                cursor={'pointer'}
                src="./images/filter-btn.svg"
                alt=""
              />
            )}
          </Box>
          <BottomModal
            isOpen={isFilterOpen}
            onClose={handleFilterClose}
          >
            <Filter />
          </BottomModal>

          <Box>
            {isLoading ? (
              <Box
                display={'grid'}
                height={'calc(100vh - 300px)'}
                alignContent={'center'}
              >
                <LoaderWithMessage
                  loadingText={t.pleaseWait}
                  loadingSubText={t.searchLoaderSubText}
                />
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
        </Box>
      </Box>
    </>
  )
}

export default Search
