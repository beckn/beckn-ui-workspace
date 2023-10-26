/* eslint-disable react-hooks/rules-of-hooks */
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import GeoLocationInput from '../components/geoLocationInput/GeoLocationInput'
import TopSheet from '../components/topSheet/TopSheet'
import { useLanguage } from '../hooks/useLanguage'

const HomePage = () => {
  const [address, setAddress] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [error, setFetchCurrentLocationError] = useState('')
  const { t } = useLanguage()

  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

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

  const handleConvert = async (lat: number, lang: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lang}&key=${apiKeyForGoogle}`
      )

      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address)
      } else {
        setAddress('No address found')
      }
    } catch (error) {
      console.error('Error converting coordinates to address:', error)
    }
  }

  return (
    <>
      <TopSheet currentAddress={currentAddress} />
      <Box pt={'40px'} fontSize={'40px'} fontWeight={'800'} color={'rgba(var(--color-primary))'} lineHeight={'110%'}>
        {t('openCommerce1')}
        <br />
        {t('openCommerce2')}
      </Box>

      <Box fontSize={'27px'} fontWeight={'800'} pt={'10px'}>
        {t('forAll')}
      </Box>

      <Box fontSize={'15px'} pt={'15px'} pb={'40px'}>
        {t('openCommerceDescription')}
      </Box>

      <GeoLocationInput
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        homeSearchInputButtonHandler={() => router.push(`/search?searchTerm=${searchInputValue}`)}
      />
    </>
  )
}

export default HomePage
