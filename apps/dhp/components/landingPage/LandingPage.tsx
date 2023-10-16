import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { useLanguage } from '../../hooks/useLanguage'
import { Box, Flex, Text, Input, Image } from '@chakra-ui/react'
import beckenFooter from '../../public/images/beckenFooterLogo.svg'
import styles from './LandingPage.module.css'
import TopSheet from '../topSheet/TopSheet'

const LandingPage: React.FC = () => {
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const { t, locale } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [error, setFetchCurrentLocationError] = useState('')

  const navigateToSearchResults = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/search?searchTerm=${searchTerm}`)
  }

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            // Replace with your Google Maps Geocoding API key

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyForGoogle}`
              )

              if (response.ok) {
                const data = await response.json()

                if (data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address
                  setCurrentAddress(formattedAddress)
                } else {
                  setFetchCurrentLocationError('No address found for the given coordinates.')
                }
              } else {
                alert('Failed to fetch address data.')
              }
            } catch (error) {
              alert('Error fetching address data: ' + (error as any).message)
            } finally {
              setLoadingForCurrentAddress(false)
            }
          },
          error => {
            alert('Error getting location: ' + error.message)
            setLoadingForCurrentAddress(false)
          }
        )
      } else {
        alert('Geolocation is not available in this browser.')
        setLoadingForCurrentAddress(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box p={'20px'} className={styles.mainContainer}>
      <TopSheet currentAddress={currentAddress} />
      <Text fontSize={'30px'} fontWeight={800} color={'rgba(var(--color-primary))'} pt="40px">
        {t.homeHeading}
      </Text>
      <Text fontSize={'30px'} fontWeight={800} pb={'15px'} color={'#EBF2F5'}>
        {t.headingSpan}
      </Text>
      <Text fontSize={'15px'} fontWeight={400} color={'#FFF'}>
        {t.homeText}
      </Text>
      <Flex pt={'25px'}>
        <Input
          background={'#FFF'}
          color={'#000000'}
          boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
          borderRightRadius={'unset'}
          p={'26px 15px'}
          type="text"
          name="search_input"
          placeholder="Search for Doctor"
          outline="none"
          onChange={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
          onKeyDown={event => event.key === 'Enter' && navigateToSearchResults()}
        />
        <Flex
          bg={'rgba(var(--color-primary))'}
          borderRightRadius={'6px'}
          boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
          justifyContent={'center'}
          alignItems="center"
          width={'55px'}
        >
          <Image
            src="/images/searchIcon.svg"
            onClick={e => {
              if (searchTerm) {
                navigateToSearchResults()
              }
              e.preventDefault()
            }}
            alt={'search icon'}
          />
        </Flex>
      </Flex>
      <Flex justifyContent={'center'} alignItems="center" width=" calc(100% - 40px)" position={'fixed'} bottom="15px">
        <Text pr={'8px'} fontSize="12px" color={'#FFF'}>
          {t.footerText}
        </Text>
        <Image src={beckenFooter} alt="footerLogo" width={39} height={13} />
      </Flex>
    </Box>
  )
}

export default LandingPage
