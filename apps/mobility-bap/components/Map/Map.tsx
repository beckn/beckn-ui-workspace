import { Coordinate } from '@beckn-ui/common'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useLoadScript, GoogleMap, DirectionsRenderer, MarkerF } from '@react-google-maps/api'
import { formatCoords } from '@utils/geoLocation-utils'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

interface MapProps {
  origin: Coordinate
  destination: Coordinate
}

const Map: React.FC<MapProps> = (props: MapProps) => {
  const { origin, destination } = props

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

  const { rideSearchInProgress, driverCurrentLocation } = useSelector(
    (state: CabServiceDetailsRootState) => state.cabService
  )

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
  const anchorPoint = new window.google.maps.Point(41, 75)
  return (
    <>
      <GoogleMap
        options={mapOptions}
        zoom={16}
        center={driverCurrentLocation.latitude !== 0 ? formatCoords(driverCurrentLocation) : formatCoords(origin)}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
      >
        {!rideSearchInProgress && (
          <MarkerF
            position={driverCurrentLocation.latitude !== 0 ? formatCoords(driverCurrentLocation) : formatCoords(origin)}
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
    </>
  )
}

export default Map
