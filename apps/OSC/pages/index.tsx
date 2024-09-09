import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { t } = useLanguage()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const router = useRouter()
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    router.push(`/search?searchTerm=${searchTerm}&category=FoodEnglish`)
    localStorage.setItem('homePathname', router.pathname)
  }

  const searchIconClickHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (searchTerm) {
      navigateToSearchResults()
    }
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
        blockOrder={['header', 'description', 'searchInput', 'searchByLocation']}
        headerProps={{
          name: t.localeeOpen,
          description: t.homePara
        }}
        searchProps={{
          searchPlaceholder: t.searchForProduct,
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        searchByLocation={{
          label: t.searchByLocation,
          onSearchByLocationClick: () => router.push('/searchByLocation')
        }}
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </>
  )
}

export default HomePage
