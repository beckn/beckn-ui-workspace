/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Flex, Image, Text, useBreakpoint } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import currentLogo from '@public/images/OSC_logo.svg'
import TopSheet from '@components/topSheet/TopSheet'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '../public/images/footer.svg'
import SearchInput from '@beckn-ui/becknified-components/src/components/search-input'
import { Typography } from '@beckn-ui/molecules'
import { RiArrowRightSLine } from 'react-icons/ri'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { t } = useLanguage()

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [currentLocationFetchError, setFetchCurrentLocationError] = useState('')

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

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

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            const coordinates = {
              latitude,
              longitude
            }

            localStorage.setItem('coordinates', JSON.stringify(coordinates))

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
                setFetchCurrentLocationError('Failed to fetch address data.')
                alert('Failed to fetch address data.')
              }
            } catch (error) {
              setFetchCurrentLocationError('Error fetching address data: ' + (error as any).message)
              alert('Error fetching address data: ' + (error as any).message)
            } finally {
              setLoadingForCurrentAddress(false)
            }
          },
          error => {
            setFetchCurrentLocationError('Error getting location: ' + error.message)
            alert('Error getting location: ' + error.message)
            setLoadingForCurrentAddress(false)
          }
        )
      } else {
        setFetchCurrentLocationError('Geolocation is not available in this browser.')
        alert('Geolocation is not available in this browser.')
        setLoadingForCurrentAddress(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
      />
      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        backgroundColor="white"
      >
        <Box
          pt={'30px'}
          fontSize={'40px'}
          fontWeight={'800'}
          color={'rgba(var(--color-primary))'}
          lineHeight={'110%'}
        >
          {t.localeeOpen}
        </Box>

        <Box
          fontSize={'15px'}
          mt="20px"
          mb="50px"
        >
          {t.homePara}
        </Box>
        <SearchInput
          onChangeHandler={(e: React.BaseSyntheticEvent) => setSearchTerm(e.target.value)}
          searchIcon={'/images/search.svg'}
          searchIconClickHandler={searchIconClickHandler}
          onEnterHandler={(e: { key: string }) => e.key === 'Enter' && navigateToSearchResults()}
          placeHolder="Search for Products"
        />
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          columnGap={'5px'}
          cursor={'pointer'}
          onClick={() => router.push('/searchByLocation')}
          mt="40px"
        >
          <Typography text={t.searchByLocation} />

          <RiArrowRightSLine
            size={22}
            color={'#A71B4A'}
          />
        </Flex>

        <Flex
          justifyContent={'center'}
          alignItems="center"
          width=" calc(100% - 40px)"
          position={'fixed'}
          bottom="15px"
        >
          <Text
            pr={'8px'}
            fontSize="12px"
            color={'#000000'}
          >
            {t.footerText}
          </Text>
          <Image
            src={beckenFooter}
            alt="footerLogo"
            width={39}
            height={13}
          />
        </Flex>
      </Box>
    </>
  )
}

export default HomePage