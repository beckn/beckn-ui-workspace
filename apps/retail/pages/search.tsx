import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { toBinary } from '@utils/common-utils'
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
import { LocalStorage } from '@lib/types'
import FilterIcon from '../public/images/filter-icon.svg'
import { BsFilterSquare } from 'react-icons/bs'
import search from '@beckn-ui/becknified-components/src/components/search'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm']
  const isMediumScreen = breakpoint === 'md'
  const isSmallScreen = mobileBreakpoints.includes(breakpoint)
  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  console.log('Dank', items)

  const searchPayload = {
    context: {
      domain: 'retail:1.1.0'
    },
    searchString: searchKeyword,
    category: {
      categoryCode: 'farming'
    },
    fulfillment: {
      type: 'Delivery',
      stops: [
        {
          location: '28.4594965,77.0266383'
        }
      ]
    }
  }

  const fetchDataForSearch = () => {
    if (!searchKeyword) return
    setIsLoading(true)
    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        console.log('Dank', res.data.data)
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

  const handleImageClick = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <>
      <Box display="flex">
        {!isSmallScreen && !isMediumScreen && <Filter />}
        <Box
          w="100%"
          ml={['unset', 'unset', 'unset', '36px']}
        >
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
            {(isSmallScreen || isMediumScreen) && (
              <Image
                onClick={handleImageClick}
                cursor={'pointer'}
                src="./images/filter-btn.svg"
                alt=""
              />
            )}
          </Box>
          {isSmallScreen && (
            <BottomModal
              isOpen={isFilterOpen}
              onClose={handleFilterClose}
            >
              <Filter />
            </BottomModal>
          )}
          {isMediumScreen && isFilterOpen && (
            <Box
              position={'absolute'}
              zIndex="9"
              backgroundColor={'#fff'}
              left="28%"
            >
              <Filter />
            </Box>
          )}

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
              <Flex
                flexWrap={'wrap'}
                w={['100%', '100%', '51%', '100%']}
                margin="0 auto"
              >
                {items.map((singleItem, idx) => {
                  const { item } = singleItem
                  const product = {
                    id: item.id,
                    images: item.images.map(singleImage => singleImage.url),
                    name: item.name,
                    price: item.price.value,
                    rating: '4'
                  }
                  return (
                    <ProductCard
                      key={idx}
                      productClickHandler={e => {
                        e.preventDefault()
                        if (typeof window !== 'undefined') {
                          const encodedProduct = window.btoa(toBinary(JSON.stringify(item)))
                          localStorage.setItem(
                            LocalStorage.Product,
                            JSON.stringify({
                              encodedProduct: encodedProduct,
                              product: product
                            })
                          )

                          router.push({
                            pathname: '/product',
                            query: {
                              id: item.id
                            }
                          })
                        }
                      }}
                      product={product}
                      currency={item.price.currency}
                    />
                  )
                })}
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Search
