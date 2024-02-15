import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TopSheet from '../components/topSheet/TopSheet'
import { useRouter } from 'next/router'
import GeoLocationInput from '../components/geoLocationInput/GeoLocationInput'
import { Box, Flex, Text } from '@chakra-ui/react'
import { RiArrowRightSLine } from 'react-icons/ri'
import { useLanguage } from '../hooks/useLanguage'
import { IGeoLocationSearchPageRootState } from '../lib/types/geoLocationSearchPage'

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [isSearchInputDisabled, setIsSearchInputDisabled] = useState(true)
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [currentLocationFetchError, setFetchCurrentLocationError] = useState('')
  const { t } = useLanguage()
  const geoLocationSearchPageSelectedAddress = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoAddress
  })

  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

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

  useEffect(() => {
    if (currentAddress.trim().length || geoLocationSearchPageSelectedAddress.trim().length) {
      setIsSearchInputDisabled(false)
    }
  }, [currentAddress, geoLocationSearchPageSelectedAddress])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
      />
      <Box
        pt={'40px'}
        fontSize={'40px'}
        fontWeight={'800'}
        color={'rgba(var(--color-primary))'}
        lineHeight={'110%'}
      >
        {t.greenSpin}
      </Box>

      <Box
        fontSize={'15px'}
        m={'20px 0px'}
      >
        {t.homePara}
      </Box>
      <Box>
        <GeoLocationInput
          disabled={isSearchInputDisabled}
          searchInputValue={searchTerm}
          setSearchInputValue={setSearchTerm}
          homeSearchInputButtonHandler={() => {
            router.push(`/search?searchTerm=${searchTerm}`)
          }}
        />
      </Box>
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        columnGap={'5px'}
        cursor={'pointer'}
        onClick={() => router.push('/searchByLocation')}
        mt={'20px'}
      >
        <Text>{t.searchbyLocation}</Text>
        <RiArrowRightSLine
          size={22}
          color={'#A71B4A'}
        />
      </Flex>
    </>
  )
}

export default LandingPage
