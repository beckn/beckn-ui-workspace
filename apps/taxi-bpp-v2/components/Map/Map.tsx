import { Coordinate } from '@beckn-ui/common'
import { useLoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import React, { useRef } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface MapProps {
  origin: Coordinate
  destination?: Coordinate
}

const Map = (props: MapProps) => {
  const { origin, destination } = props
  const { latitude, longitude } = origin || {}

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [carPosition, setCarPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([])
  const [focusOnCar, setFocusOnCar] = useState<google.maps.LatLngLiteral | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const index = useRef<number>(0)

  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => ({ lat: latitude, lng: longitude }), [origin])

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      gestureHandling: 'greedy'
    }),
    []
  )
  const { isLoaded, loadError } = useLoadScript({
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
  }, [destination, mapCenter])

  useEffect(() => {
    fetchDirections()
  }, [fetchDirections])

  useEffect(() => {
    if (routePoints.length > 0) {
      // let index = 0

      const moveCar = () => {
        if (index.current < routePoints.length) {
          setCarPosition(routePoints[index.current])
          if (!userInteracted) {
            setFocusOnCar(routePoints[index.current])
          }
          index.current++
        } else {
          clearInterval(carInterval)
        }
      }

      const carInterval = setInterval(moveCar, 500)
      return () => clearInterval(carInterval)
    }
  }, [routePoints, userInteracted])

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map)
    map.addListener('dragstart', () => setUserInteracted(true))
    map.addListener('zoom_changed', () => setUserInteracted(true))
    map.addListener('idle', () => setUserInteracted(false))
  }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={mapOptions}
          zoom={16}
          center={focusOnCar ? focusOnCar : mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
          onLoad={handleMapLoad}
        >
          <MarkerF
            position={focusOnCar ? focusOnCar : mapCenter}
            icon={{
              url: './images/ripple.svg' //https://img.icons8.com/fluency/48/map-pin.png
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
              {/* {carPosition && (
                <MarkerF
                  position={carPosition}
                  // icon={{
                  //   url: '/images/map_car.svg',
                  //   scaledSize: new google.maps.Size(50, 50)
                  // }}
                />
              )} */}
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
