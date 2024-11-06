import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import dragonMobLogo from '@public/images/dragonFoodLogo.svg'
import skyAnalytic from '@public/images/sky1.svg'
import flood from '@public/images/sky2.svg'
import cinematic from '@public/images/sky3.svg'
import FrequentlyAccessed from '../components/frequentlyAccessed/FrequentlyAccessed'

export const frequentlyAccessedData = [
  {
    id: '1',
    images: [skyAnalytic],
    name: 'Sky Analytics',
    shortDesc: 'High resolution probabilistic flo...',
    price: { value: 0 },
    rateLabel: '',
    rating: '4.2',
    source: 'Sold By',
    sourceText: 'Sky Analytics',
    productInfo: '',
    yearsOfOperation: 7
  },
  {
    id: '2',
    images: [flood],
    name: 'FloodCase',
    shortDesc: 'Hydraulic model flood prediction...',
    price: { value: 0 },
    rateLabel: '',
    rating: '4.2',
    source: 'Sold By',
    sourceText: 'FloodCase',
    productInfo: '',
    yearsOfOperation: 4
  },
  {
    id: '3',
    images: [cinematic],
    name: 'Climatic',
    shortDesc: 'Medium resolution integrated mod...',
    price: { value: 0 },
    rateLabel: '',
    rating: '4.2',
    source: 'Sold By',
    sourceText: 'Climatic',
    productInfo: '',
    yearsOfOperation: 2
  }
]
// ... existing code ...
const HomePage = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

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
          logoSrc: dragonMobLogo,
          altText: 'Dragon Logo'
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
            <FrequentlyAccessed frequentlyAccessedData={frequentlyAccessedData} />
          </>
        }
      />
    </>
  )
}

export default HomePage
