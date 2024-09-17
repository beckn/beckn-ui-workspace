import React from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '@public/images/beckenFooterLogo.svg'
import { HomePageContent, IGeoLocationSearchPageRootState } from '@beckn-ui/common'
import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import Router from 'next/router'
import Cookies from 'js-cookie'

const HomePage = () => {
  const { t } = useLanguage()

  const geoLocationSearchPageSelectedAddress = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoAddress
  })

  const navigateToSearchResult = () => {
    const loc = geoLocationSearchPageSelectedAddress.split(',')[0]
    Router.push(`/search?searchTerm=${loc}`)
  }

  return (
    <Box className={'main_container'}>
      <HomePageContent
        blockOrder={['header', 'description', 'geoLocationInput']}
        headerProps={{
          name: t.homeHeading,
          title: t.headingSpan,
          description: t.homeText
        }}
        geoLocationInput={{
          placeholder: t.searchForTravelLocation,
          geoLocationSearchPageSelectedAddress: geoLocationSearchPageSelectedAddress,
          navigateToSearchResult: () => navigateToSearchResult()
        }}
        footerProps={{
          poweredByText: t.footerText,
          poweredByLogoSrc: beckenFooter
        }}
      />
    </Box>
  )
}

export default HomePage
