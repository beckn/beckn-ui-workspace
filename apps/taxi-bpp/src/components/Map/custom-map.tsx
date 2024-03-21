'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
//import { usePosition } from "../hooks/usePosition";
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'

const defaultStyle = {
  top: '140px',
  width: '100%',
  position: 'absolute',
  bottom: '45px'
}
const customStyle = {
  top: '50px',
  width: '100%',
  height: '20vh'
}

function CustomMap({ latitude, longitude, mapType = 'start', locations = [] }: any) {
  const [directions, setDirections] = useState<any>(null)
  const [originPosition, destinationPosition] = locations
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string
  })
  const [map, setMap] = useState<any>(null)

  const onLoad = useCallback(function callback(map: any) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  const position = {
    lat: latitude || 12.903561,
    lng: longitude || 77.5939631
  }
  useEffect(() => {}, [directions])
  useEffect(() => {
    if (isLoaded && locations.length > 0) {
      const DirectionsService = new window.google.maps.DirectionsService()

      DirectionsService.route(
        {
          origin: new window.google.maps.LatLng(originPosition?.Lat || latitude, originPosition?.Lng || longitude),
          destination: new window.google.maps.LatLng(
            destinationPosition?.Lat || 25.624,
            destinationPosition?.Lng || 85.04
          ),
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result)
          } else {
            console.error(`error fetching directions ${result}`)
          }
        }
      )
    }
    return () => {}
  }, [isLoaded, locations])
  return (
    <div>
      {isLoaded && (
        <div>
          <GoogleMap
            center={position}
            zoom={8}
            mapContainerStyle={mapType === 'end' ? customStyle : defaultStyle}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: false
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <Marker position={position} />
            {locations.length > 0 && directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: 'black'
                  }
                }}
              />
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  )
}

export default memo(CustomMap)
