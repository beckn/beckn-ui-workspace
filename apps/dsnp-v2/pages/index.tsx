import { useBreakpoint } from '@chakra-ui/react'

import { useRouter } from 'next/router'
import React, { useState } from 'react'
import KuzaLogo from '@public/images/dsnp-text-img.svg'
import AlternateLogo from '@public/images/dsnp-text-img.svg'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? KuzaLogo : AlternateLogo
  const { t } = useLanguage()

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const router = useRouter()

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    router.push(`/search?searchTerm=${searchTerm}`)
  }

  const searchIconClickHandler = (e: any) => {
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
        blockOrder={['header', 'description', 'searchInput']}
        headerProps={{
          name: 'Open Commerce',
          title: t.forAll,
          description: t.subText
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
      />
    </>
  )
}

export default HomePage
