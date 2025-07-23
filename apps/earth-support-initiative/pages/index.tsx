import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import { discoveryActions, HomePageContent, ParsedItemModel, TopSheet, useGeolocation } from '@beckn-ui/common'
import esiLogo from '@public/images/esi_logo.svg'
import FrequentlyAccessed from '../components/frequentlyAccessed/FrequentlyAccessed'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { Box } from '@chakra-ui/react'

const HomePage = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)
  const { user } = useSelector((state: RootState) => state.auth)

  const router = useRouter()

  const [frequentlyAccessedData, setFrequentlyAccessedData] = useState<any[]>([])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('recentlyViewed') || '{}')
    const userData = storedData[user?.id!]?.recentlyViewed?.products || []
    setFrequentlyAccessedData(userData)
  }, [])

  const handleClickCardHandler = (selectedItem: ParsedItemModel) => {
    const product = {
      id: selectedItem.item.id,
      name: selectedItem.item.name
    }

    dispatch(discoveryActions.addSingleProduct({ product: selectedItem }))

    router.push({
      pathname: '/product',
      query: {
        id: selectedItem.item.id,
        search: searchTerm
      }
    })

    localStorage.setItem('selectCardHeaderText', JSON.stringify(product.name))
  }
  const navigateToSearchResults = () => {
    if (searchTerm) {
      localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
      router.push(`/search?searchTerm=${searchTerm}`)
    }
  }

  const searchIconClickHandler = (e: React.MouseEvent) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />

      <HomePageContent
        blockOrder={['appLogo', 'searchInput', 'customComponent']}
        headerProps={{
          name: '',
          title: '',
          description: '',
          logoSrc: esiLogo,
          altText: 'ESI Logo'
        }}
        searchProps={{
          searchPlaceholder: t.searchPlaceholder,
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
        customComponent={
          <>
            <FrequentlyAccessed
              frequentlyAccessedData={frequentlyAccessedData}
              onCardClick={handleClickCardHandler}
            />
          </>
        }
      />
    </>
  )
}

export default HomePage
