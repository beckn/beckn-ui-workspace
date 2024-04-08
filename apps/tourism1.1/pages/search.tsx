import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { ProductCard } from '@beckn-ui/becknified-components'
import { discoveryActions } from '@store/discovery-slice'
import SearchBar from '../components/header/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel } from '@lib/types/beckn/search'

import LoaderWithMessage from '@components/loader/LoaderWithMessage'

import { IGeoLocationSearchPageRootState } from '@lib/types/geoLocationSearchPage'
import useRequest from '@hooks/useRequest'
import { responseDataActions } from '@store/responseData-slice'
import { RetailItem } from '@lib/types/products'

const Search = () => {
  const [items, setItems] = useState<ParsedItemModel[]>([])
  const dispatch = useDispatch()
  const searchAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.geoAddress
  )
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, loading, error, fetchData } = useRequest()

  const router = useRouter()
  const { t } = useLanguage()

  const searchPayload = {
    context: {
      domain: 'retail'
    },
    message: {
      criteria: {
        dropLocation: '12.9715987,77.5945627',
        categoryName: 'TourismEnglish',
        searchString: searchAddress
      }
    }
  }

  const fetchDataForSearch = (payload: any) => fetchData(`${apiUrl}/client/v2/search`, 'POST', payload)

  useEffect(() => {
    if (searchAddress) {
      localStorage.removeItem('searchItems')
      localStorage.setItem('optionTags', JSON.stringify({ name: searchAddress }))
      window.dispatchEvent(new Event('storage-optiontags'))
      fetchDataForSearch(searchPayload)
    }
  }, [searchAddress])

  useEffect(() => {
    if (data) {
      dispatch(responseDataActions.addTransactionId(data.context.transaction_id))
      const allItems = data.message.catalogs.flatMap((catalog: any) => {
        if (catalog.message && catalog.message.catalog && catalog.message.catalog['bpp/providers'].length > 0) {
          const providers = catalog.message.catalog['bpp/providers']
          return providers.flatMap((provider: any) => {
            if (provider.items && provider.items.length > 0) {
              return provider.items.map((item: RetailItem) => {
                return {
                  bpp_id: catalog.context.bpp_id,
                  bpp_uri: catalog.context.bpp_uri,
                  ...item,
                  providerId: provider.id,
                  locations: provider.locations,
                  bppName: catalog.message.catalog['bpp/descriptor'].name
                }
              })
            }
            return []
          })
        }
        return []
      })
      localStorage.setItem('searchItems', JSON.stringify(allItems))
      setItems(allItems)
    }
  }, [data])

  return (
    <>
      <Box>
        <SearchBar
          searchString={''}
          handleChange={(text: string) => {}}
        />
      </Box>
      <Box>
        {loading ? (
          <LoaderWithMessage
            loadingSubText={`${t.catalogSubLoader} ${searchAddress}`}
            loadingText={t.catalogLoader}
          />
        ) : (
          <>
            {items.map((singleItem, idx) => {
              const { descriptor, price, tags } = singleItem
              const product = {
                id: singleItem.id,
                images: descriptor.images.map(singleImage => singleImage),
                name: descriptor.name,
                price: price.value,
                rating: tags.rating,
                shortDesc: descriptor.short_desc
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
                        id: singleItem.id,
                        search: searchAddress
                      }
                    })
                    localStorage.setItem('selectCardHeaderText', product.name)
                  }}
                  product={product}
                  currency={price.currency}
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
