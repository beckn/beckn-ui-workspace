import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Box } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const RentAndHire = () => {
  const { t } = useLanguage()
  const [address, setAddress] = useState('')
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
    <Box
      className="myStore-homepage"
      mt="-60px"
    >
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />
      <HomePageContent
        blockOrder={['header', 'description', 'searchInput']}
        headerProps={{
          name: 'My Rental Services',
          description: t.subTextForRenT
        }}
        searchProps={{
          searchPlaceholder: t.searchPlaceholder,
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        showFooter={false}
        footerProps={{
          poweredByLogoSrc: '',
          poweredByText: ''
        }}
      />
      <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
      >
        <BecknButton
          text="Go Back Home"
          handleClick={() => {
            Router.push('/')
          }}
        />
      </Box>
    </Box>
  )
}

export default RentAndHire
