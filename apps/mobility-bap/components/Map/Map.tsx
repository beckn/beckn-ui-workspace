// @ts-nocheck
import { useLoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { useMemo, useState, useEffect, useCallback } from 'react'

interface Coordinate {
  lat: number
  long: number
}

interface MapProps {
  source: Coordinate
  destination: Coordinate
}

const formatCoords = (coord: Coordinate) => {
  return { lat: coord.lat, lng: coord.long }
}

const Map: React.FC<MapProps> = (props: MapProps) => {
  const { source, destination } = props
  const [directions, setDirections] = useState(null)

  const isValidCoords = (coords: Coordinate) => {
    return (
      coords &&
      typeof coords.lat === 'number' &&
      typeof coords.long === 'number' &&
      coords.lat !== 0 &&
      coords.long !== 0
    )
  }

  const calculateRoute = useCallback((start, end) => {
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
    if (!(isValidCoords(source) && isValidCoords(destination))) return

    const start = new google.maps.LatLng(source.lat, source.long)
    const end = new google.maps.LatLng(destination.lat, destination.long)

    calculateRoute(start, end)
  }, [source, destination])

  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => (source ? formatCoords(source) : null), [source])

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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: libraries as any
  })

  return (
    <>
      <GoogleMap
        options={mapOptions}
        scrollWheelZoom={true}
        zoomAnimation={true}
        center={mapCenter}
        mapContainerStyle={{ maxHeight: '100vh', height: '90vh' }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {!directions && source && <Marker position={formatCoords(source)} />}
        {!directions && destination && <Marker position={formatCoords(destination)} />}
      </GoogleMap>
    </>
  )
}

export default Map
