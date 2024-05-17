import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Card, CardBody, Divider, Flex, Image } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { setPickupAddress, toggleLocationSearchPageVisibility } from 'store/geoMapLocationSearch-slice'
import { Router, useRouter } from 'next/router'

type Coords = {
  lat: number
  long: number
}

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), {
    ssr: false
  })
  const dispatch = useDispatch()

  const router = useRouter()

  const [coords, setCoords] = useState<Coords>({ lat: 0, long: 0 })
  const [currentAddress, setCurrentAddress] = useState('')
  const [loadingForCurrentAddress, setLoadingForCurrentAddress] = useState(true)
  const [currentLocationFetchError, setFetchCurrentLocationError] = useState('')

  const googleMapApi = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_URL
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const onFocusChange = (addressType: 'pickup' | 'dropoff') => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }
  useEffect(() => {
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            // Replace with your Google Maps Geocoding API key
            const coordinates = { lat: latitude, long: longitude }
            setCoords(coordinates)
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyForGoogle}`
              )

              if (response.ok) {
                const data = await response.json()

                if (data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address
                  setCurrentAddress(formattedAddress)
                  dispatch(setPickupAddress(formattedAddress))
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
  console.log(coords)
  return (
    <div className="overflow-hidden max-h-[85vh]">
      <MapWithNoSSR coords={coords} />
      <Card
        zIndex={'999'}
        position="absolute"
        bottom={'0'}
        w="100%"
        borderRadius={'16px'}
        borderBottomLeftRadius="unset"
        borderBottomRightRadius="unset"
        boxShadow="0px -4px 16px 0px #0000001F"
      >
        <CardBody padding={'20px 20px 10px 20px'}></CardBody>
      </Card>
    </div>
  )
}

export default Homepage
