import { Coordinate } from '@beckn-ui/common'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useLoadScript, GoogleMap, DirectionsRenderer, MarkerF } from '@react-google-maps/api'
import { formatCoords } from '@utils/geoLocation-utils'
import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import MyLocation from '@public/images/my_location.svg'
import { testIds } from '@shared/dataTestIds'
import { Box } from '@chakra-ui/react'

interface MapProps {
  startNav: boolean
  enableMyLocation: boolean
  origin: Coordinate
  destination: Coordinate
  setCurrentOrigin: (location: any | null) => void
}

const Map: React.FC<MapProps> = (props: MapProps) => {
  const { origin, destination, startNav, setCurrentOrigin, enableMyLocation } = props

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [carPosition, setCarPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([])
  const [focusOnCar, setFocusOnCar] = useState<google.maps.LatLngLiteral | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const index = useRef<number>(0)
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null)

  const { rideSearchInProgress } = useSelector((state: CabServiceDetailsRootState) => state.cabService)

  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => formatCoords(origin), [origin])

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
    libraries: libraries as any
  })

  const fetchDirections = useCallback(() => {
    if (destination.latitude === 0) return

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
          setCarPosition(nextPosition)

          if (!userInteracted) {
            setFocusOnCar(nextPosition)
          }
          index.current++
        } else {
          clearInterval(carInterval)
        }
      }

      const carInterval = setInterval(moveCar, 100)
      return () => clearInterval(carInterval)
    }
  }, [routePoints, userInteracted, startNav])

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map)

    const handleUserInteraction = () => {
      setUserInteracted(true)

      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current)
      }

      interactionTimeout.current = setTimeout(() => {
        setUserInteracted(false)
      }, 5000)
    }

    map.addListener('dragstart', handleUserInteraction)
    map.addListener('zoom_changed', handleUserInteraction)

    if (enableMyLocation) {
      const locationButton = document.createElement('img')
      locationButton.src = MyLocation
      locationButton.classList.add('custom-location-button')
      locationButton.style.background = '#ffffff'
      locationButton.style.border = '2px solid #EFEFEF'
      locationButton.style.borderRadius = '22px'
      locationButton.style.margin = '10px'
      locationButton.style.cursor = 'pointer'

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
                    map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude })
                    setCurrentOrigin({ ...userLocation, address: results[0].formatted_address })
                    map.setZoom(16)
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

      // Add the button to the map controls
      map.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(locationButton)
    }
  }

  const anchorPoint = new window.google.maps.Point(41, 75)
  return (
    <Box data-test={testIds.mobility_map}>
      {isLoaded && (
        <GoogleMap
          options={mapOptions}
          zoom={16}
          center={focusOnCar || formatCoords(origin)}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
          onLoad={handleMapLoad}
        >
          {!rideSearchInProgress && (
            <MarkerF
              position={carPosition || formatCoords(origin)}
              icon={{
                url: './images/marker.svg',
                scaledSize: new window.google.maps.Size(100, 100),
                anchor: anchorPoint
              }}
            />
          )}
          {rideSearchInProgress && (
            <MarkerF
              position={formatCoords(origin)}
              icon={{
                url: './images/ripple.svg',
                scaledSize: new window.google.maps.Size(100, 100),
                anchor: anchorPoint
              }}
            />
          )}
          {!rideSearchInProgress && (
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
              {directions && destination && (
                <MarkerF
                  position={formatCoords(destination)}
                  icon={{
                    url: 'https://img.icons8.com/fluency/48/map-pin.png'
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
      )}
    </Box>
  )
}

export default Map
