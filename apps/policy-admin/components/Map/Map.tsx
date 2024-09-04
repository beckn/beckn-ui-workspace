import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useLoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { Coordinate } from '@beckn-ui/common'
import { formatCoords } from '@utils/geoLocation-utils'

interface MapProps {
  startNav: boolean
  origin: Coordinate
  destination?: Coordinate
}

const Map = (props: MapProps) => {
  const { origin, destination, startNav } = props

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [carPosition, setCarPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([])
  const [focusOnCar, setFocusOnCar] = useState<google.maps.LatLngLiteral | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const index = useRef<number>(0)
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null)

  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => formatCoords(origin), [origin])

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      gestureHandling: 'greedy'
    }),
    []
  )

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: libraries as any
  })

  const fetchDirections = useCallback(() => {
    if (!destination) return

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
  }

  const anchorPoint = new window.google.maps.Point(20, 32)

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={mapOptions}
          zoom={16}
          center={focusOnCar || mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
          onLoad={handleMapLoad}
        >
          <MarkerF
            position={carPosition || mapCenter}
            icon={{
              url: './images/ripple.svg',
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: anchorPoint
            }}
          />
          {directions && (
            <>
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
              {destination && (
                <MarkerF
                  position={{ lat: destination.latitude, lng: destination.longitude }}
                  icon={{
                    url: 'https://img.icons8.com/fluency/48/map-pin.png'
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default React.memo(Map)
