import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '@public/images/footer.svg'
import whatsappIcon from '@public/images/whatsapp.svg'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import ClickableImage from '@components/ClickableImage'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Button } from '@beckn-ui/molecules'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const LandingPage = () => {
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState<string>('1')

  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const navigateToSearchResults = () => {
    if (searchTerm) {
      localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
      router.push(`/search?searchTerm=${searchTerm}&lat=${coordinates?.latitude}&long=${coordinates?.longitude}`)
    }
  }

  const handleOnClick = (e: React.MouseEvent, navigateTo: 'beckn-bot' | 'beckn-grid-connect') => {
    if (navigateTo === 'beckn-grid-connect') {
      router.push('/homePage')
    }
    if (navigateTo === 'beckn-bot') {
      const url = 'https://wa.me/916364334426'
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    e.preventDefault()
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 90px) auto"
      backgroundColor="white"
    >
      <Flex flexDirection={'column'}>
        <BecknButton
          text="Talk to Lisa"
          leftIcon={
            <Image
              src={whatsappIcon}
              alt="whatsapp-icon"
            />
          }
          sx={{
            backgroundColor: '#02AD57'
          }}
          handleClick={e => handleOnClick(e, 'beckn-bot')}
        />
        <Button
          text="Open Spark"
          sx={{
            backgroundColor: '#EBEBED',
            color: '#000000',
            fontWeight: '500'
          }}
          handleClick={e => handleOnClick(e, 'beckn-grid-connect')}
        />
      </Flex>
      <PoweredBy
        logoSrc={beckenFooter}
        poweredByText={t.footerText}
      />
    </Box>
  )
}

export default LandingPage
