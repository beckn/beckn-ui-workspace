import React, { useEffect, useState } from 'react'
import axios from '@services/axios'
import { useDispatch } from 'react-redux'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { parseSearchlist } from '@beckn-ui/common'
import { ProductCard } from '@beckn-ui/becknified-components'
import { BottomModal } from '@beckn-ui/molecules'
import { discoveryActions } from '@beckn-ui/common/src/store/discovery-slice'
import { useBreakpoint } from '@chakra-ui/react'
import SearchBar from '../components/header/SearchBar'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '@beckn-ui/common'
import { DOMAIN } from '@lib/config'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import Filter from '../components/filter/Filter'

//Mock data for testing search API. Will remove after the resolution of CORS issue

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const [originalItems, setOriginalItems] = useState<ParsedItemModel[]>([])
  const [sortBy, setSortBy] = useState<string>('')
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
  const searchByLocationPathname = typeof window !== 'undefined' ? localStorage.getItem('routerPathname') : null
  const homePagePathname = typeof window !== 'undefined' ? localStorage.getItem('homePagePathname') : null
  const [providerId, setProviderId] = useState('')
  const [tagValue, setTagValue] = useState('')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleImageClick = () => {
    setIsFilterOpen(!isFilterOpen)
  }
  const handleApplyFilter = (sortBy: string) => {
    setSortBy(sortBy)

    const sortedItemsCopy = [...originalItems]

    if (sortBy === 'LowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
    } else if (sortBy === 'HightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
    } else if (sortBy === 'RatingLowtoHigh') {
      sortedItemsCopy.sort((a, b) => parseFloat(a.item.rating) - parseFloat(b.item.rating))
    } else if (sortBy === 'RatingHightoLow') {
      sortedItemsCopy.sort((a, b) => parseFloat(b.item.rating) - parseFloat(a.item.rating))
    }

    setItems(sortedItemsCopy)
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setItems(originalItems)
  }
  const handleCancelFilter = () => {
    setIsFilterOpen(false)
  }
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 95px)"
      overflowY={'scroll'}
    >
      <Box display="flex">
        {!isSmallScreen && !isMediumScreen && (
          <Filter
            handleApplyFilter={handleApplyFilter}
            handleResetFilter={handleResetFilter}
            handleCancelFilter={handleCancelFilter}
          />
        )}
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
                localStorage.removeItem('routerPathname')
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
              <Filter
                handleApplyFilter={handleApplyFilter}
                handleResetFilter={handleResetFilter}
                handleCancelFilter={handleCancelFilter}
              />
            </BottomModal>
          )}
          {isMediumScreen && isFilterOpen && (
            <Box
              position={'absolute'}
              zIndex="9"
              backgroundColor={'#fff'}
              left="28%"
            >
              <Filter
                handleApplyFilter={handleApplyFilter}
                handleResetFilter={handleResetFilter}
                handleCancelFilter={handleCancelFilter}
              />
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
                    rating: item.rating,
                    // shortDesc: item.short_desc || item.long_desc.replace(/<[^>]+>/g, '').slice(0, 15),
                    source: t.soldBy,
                    sourceText: items[0].providerName
                  }
                  return (
                    <ProductCard
                      key={idx}
                      productClickHandler={e => {
                        e.preventDefault()
                        dispatch(discoveryActions.addSingleProduct({ product: singleItem }))
                        router.push({
                          pathname: '/product',
                          query: {
                            id: item.id,
                            search: searchKeyword
                          }
                        })
                        localStorage.setItem('selectCardHeaderText', product.name)
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
    </Box>
  )
}

export default Search
