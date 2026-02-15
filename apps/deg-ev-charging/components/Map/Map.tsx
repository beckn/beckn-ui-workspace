import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Coordinate, Item, ParsedItemModel } from '@beckn-ui/common'
import { useLoadScript, GoogleMap, DirectionsRenderer, MarkerF } from '@react-google-maps/api'
import { formatCoords } from '@utils/geoLocation-utils'
import MyLocation from '@public/images/my_location.svg'
import { testIds } from '@shared/dataTestIds'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
// import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'

interface EVCharger {
  id: string
  latitude: number
  longitude: number
  name: string
  status: string
  address: string
  rate: number
  ports: Array<{
    id: string
    type: string
    icon?: string
  }>
  data?: { providerDetails: ParsedItemModel; itemDetails: Item }
}

export type { EVCharger }

interface MapProps {
  startNav: boolean
  enableMyLocation: boolean
  origin: Coordinate
  destination: Coordinate
  showConnectWallet?: boolean
  setCurrentOrigin: (location: { latitude: number; longitude: number; address?: string } | null) => void
  handleOnConnectWallet?: () => void
  evChargers?: EVCharger[]
  onChargerSelect?: (charger: EVCharger) => void
  handleOnSearch?: (query: string) => void
  searchQuery?: string
  enableSearch?: boolean
}

const Map: React.FC<MapProps> = (props: MapProps) => {
  const {
    origin,
    destination,
    startNav,
    setCurrentOrigin,
    enableMyLocation,
    showConnectWallet,
    handleOnConnectWallet,
    evChargers,
    onChargerSelect,
    handleOnSearch,
    searchQuery,
    enableSearch = true
  } = props

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([])
  const [, setFocusOnCar] = useState<google.maps.LatLngLiteral | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)

  const index = useRef<number>(0)
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null)

  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => {
    const coords = formatCoords(origin)
    setUserLocation(coords)
    return coords
  }, [origin])

  const isValidCoords = (coords: Coordinate) => {
    return (
      coords &&
      typeof coords.latitude === 'number' &&
      typeof coords.longitude === 'number' &&
      coords.latitude !== 0 &&
      coords.longitude !== 0
    )
  }

  const calculateRoute = useCallback((start: google.maps.LatLng, end: google.maps.LatLng) => {
    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result)
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!(isValidCoords(origin) && isValidCoords(destination))) return

    const start = new google.maps.LatLng(origin.latitude, origin.longitude)
    const end = new google.maps.LatLng(destination.latitude, destination.longitude)

    calculateRoute(start, end)
  }, [origin, destination])

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      zoom: 14,
      zoomControl: false
    }),
    []
  )

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: libraries as 'places'[]
  })

  const fetchDirections = useCallback(() => {
    if (!isValidCoords(destination)) return

    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin: mapCenter,
        destination: { lat: destination.latitude, lng: destination.longitude },
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result)
          const path = result.routes[0].overview_path
          setRoutePoints(path.map(point => ({ lat: point.lat(), lng: point.lng() })))
          // Auto-center and zoom on the route
          if (map) {
            const bounds = new google.maps.LatLngBounds()
            path.forEach(point => bounds.extend(point))
            map.fitBounds(bounds)
          }
        } else {
          console.error(`Error fetching directions: ${status}`)
        }
      }
    )
  }, [destination, mapCenter, map])

  useEffect(() => {
    fetchDirections()
  }, [fetchDirections])

  useEffect(() => {
    if (startNav && routePoints.length > 0) {
      const moveCar = () => {
        if (index.current < routePoints.length) {
          const nextPosition = routePoints[index.current]
          setFocusOnCar(nextPosition)
          index.current++
        } else {
          clearInterval(carInterval)
        }
      }

      const carInterval = setInterval(moveCar, 100)
      return () => clearInterval(carInterval)
    }
  }, [routePoints, startNav])

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map)

    const handleUserInteraction = () => {
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current)
      }
    }

    map.addListener('dragstart', handleUserInteraction)
    map.addListener('zoom_changed', handleUserInteraction)

    if (enableMyLocation) {
      const locationButton = document.createElement('img')
      locationButton.src = MyLocation
      locationButton.classList.add('custom-location-button')
      locationButton.style.cssText = `
        background: #ffffff;
        border: 2px solid #EFEFEF;
        border-radius: 22px;
        margin: 10px;
        cursor: pointer;
        padding: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: fixed;
        bottom: 82px;
        right: 10px;
        z-index: 1;
        width: 40px;
        height: 40px;
      `

      locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }

              const geocoder = new window.google.maps.Geocoder()
              geocoder.geocode(
                { location: { lat: userLocation.latitude, lng: userLocation.longitude } },
                (results, status) => {
                  if (status === 'OK' && results?.[0]) {
                    const newLocation = { lat: userLocation.latitude, lng: userLocation.longitude }
                    map.panTo(newLocation)
                    map.setZoom(18)
                    setCurrentOrigin({ ...userLocation, address: results[0].formatted_address })
                    setUserLocation(newLocation)
                  } else {
                    console.error('Geocoder failed due to: ' + status)
                  }
                }
              )
            },
            () => alert('Failed to get your location!')
          )
        } else {
          alert('Geolocation is not supported by your browser!')
        }
      })

      map.getDiv().appendChild(locationButton)
    }
  }

  const onFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnSearch?.(e.target.value)
  }

  const clearSearch = () => {
    handleOnSearch?.('')
  }

  return (
    <Box
      data-test={testIds.mobility_map}
      position="relative"
    >
      <Flex
        position="fixed"
        top="20px"
        left="50%"
        transform="translateX(-50%)"
        zIndex={2}
        gap={4}
        width="90%"
        maxWidth="800px"
        alignItems="center"
        margin={'20px auto'}
      >
        {enableSearch && (
          // <SearchBar
          //   searchString={searchQuery}
          //   placeholder={'Search Location'}
          //   handleChange={(text: string) => {
          //     console.log('text', text)
          //   }}
          //   // handleOnFocus={() => handleOnSearch?.('')}
          // />
          <Box
            position="relative"
            width="100%"
            className="map_search_input"
          >
            <Input
              pl="40px"
              pr="40px"
              height="40px"
              backgroundColor="#F7F7F7"
              border="1px solid #E5E5E5"
              borderRadius="16px"
              fontSize="16px"
              placeholder="Search Location"
              _placeholder={{ color: '#666666' }}
              value={searchQuery}
              _focus={{
                outline: 'none',
                boxShadow: 'none',
                borderColor: '#E5E5E5',
                backgroundColor: '#ffffff'
              }}
              onChange={onFocusChange}
              data-test={testIds.device_location_input}
            />
            <Image
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              src="/images/searchInput.svg"
              width="20px"
              zIndex={1}
              data-test={testIds.device_location_search_icon}
            />
            {searchQuery && (
              <Image
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                src="/images/clearIcon.svg"
                width="20px"
                zIndex={1}
                cursor="pointer"
                onClick={clearSearch}
              />
            )}
          </Box>
        )}
        {showConnectWallet && (
          <BecknButton
            text="Connect Wallet"
            handleClick={() => handleOnConnectWallet?.()}
            sx={{
              width: '150px',
              height: '38px',
              fontSize: '12px',
              fontWeight: '400',
              padding: '1rem 2rem',
              borderRadius: '12px',
              mb: 'unset'
            }}
          />
        )}
      </Flex>
      {isLoaded && (
        <GoogleMap
          options={mapOptions}
          zoom={evChargers && evChargers?.length > 0 ? 13 : 16}
          center={formatCoords(origin)}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{
            width: '100%',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onLoad={handleMapLoad}
        >
          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={{
                url: './images/marker.svg',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16)
              }}
            />
          )}

          {evChargers?.map(charger => (
            <MarkerF
              key={charger.id}
              position={{ lat: charger.latitude, lng: charger.longitude }}
              icon={{
                url: './images/ev_charger.svg',
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16)
              }}
              title={charger.name}
              onClick={() => onChargerSelect?.(charger)}
            />
          ))}

          <>
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#088ed8',
                    strokeOpacity: 1,
                    strokeWeight: 8,
                    geodesic: true
                  }
                }}
              />
            )}
            {/* {directions && origin && (
              <MarkerF
                position={formatCoords(origin)}
                icon={{
                  url: './images/marker.svg',
                  scaledSize: new window.google.maps.Size(100, 100),
                  anchor: anchorPoint
                }}
              />
            )} */}
            {/* {directions && destination && (
              <MarkerF
                position={formatCoords(destination)}
                icon={{
                  url: 'https://img.icons8.com/fluency/48/map-pin.png'
                }}
              />
            )} */}
          </>
        </GoogleMap>
      )}
    </Box>
  )
}

export default Map
