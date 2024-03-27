import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Card, CardBody, Divider, Flex, Image } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState } from 'lib/types/geoLocationSearchPage'
import {
  toggleLocationDropoffPageVisibility,
  toggleLocationSearchPageVisibility
} from 'store/geoMapLocationSearch-slice'
import { Router, useRouter } from 'next/router'

type Coords = {
  lat: number
  long: number
}

const Homepage = () => {
  const MapWithNoSSR = dynamic(() => import('../components/Map'), {
    ssr: false
  })
  const dispatch = useDispatch()
  const pickupAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.pickupAddress
  )
  const dropoffAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.dropoffAddress
  )
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

  const fetchLocationNameByCoords = async (lat: number, long: number) => {
    try {
      const response = await fetch(`${googleMapApi}/api/geocode/json?latlng=${lat},${long}&key=${apiKeyForGoogle}`)

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
  }

  useEffect(() => {
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            const coordinates = { lat: latitude, long: longitude }
            setCoords(coordinates)
            localStorage.setItem('coordinates', JSON.stringify(coordinates))
            await fetchLocationNameByCoords(latitude, longitude)
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
  }, [])
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
        <CardBody padding={'20px 20px 10px 20px'}>
          <Box
            fontSize={'18px'}
            fontWeight="600"
            mb="20px"
          >
            Where Would You Like To Go?
          </Box>
          <Divider mb="20px" />
          <Flex
            fontSize={'15px'}
            fontWeight="500"
            onClick={() => onFocusChange('pickup')}
          >
            <Image
              src="./images/locationIcon.svg"
              alt=""
            />
            <Box
              as="span"
              ml={'10px'}
              mr="5px"
            >
              Pickup :
            </Box>
            <Box
              as="span"
              fontWeight="600"
            >
              {pickupAddress === '' ? currentAddress : pickupAddress}
            </Box>
          </Flex>
          <Divider
            mb="20px"
            mt="20px"
          />
          <Flex
            fontSize={'15px'}
            fontWeight="500"
            mb="40px"
            onClick={() => onFocusChange('dropoff')}
          >
            <Image
              src="./images/locationIcon.svg"
              alt=""
            />
            <Box
              as="span"
              ml={'10px'}
              mr="5px"
            >
              Dropoff :
            </Box>
            <Box
              as="span"
              fontWeight="600"
            >
              {dropoffAddress}
            </Box>
          </Flex>
          <BecknButton
            text="Search Rides"
            handleClick={() => router.push('/searchRide')}
          />
        </CardBody>
      </Card>
    </div>
  )
}

export default Homepage
