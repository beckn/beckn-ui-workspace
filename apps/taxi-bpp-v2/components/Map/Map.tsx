// @ts-nocheck
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api'
import { useMemo, useState } from 'react'

const Map = ({ coords }) => {
  const { lat, long } = coords
  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => ({ lat: lat, lng: long }), [])

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true
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
        zoomControl={false}
        scrollWheelZoom={true}
        zoomAnimation={true}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ maxHeight: '100vh', height: '90vh' }}
      >
        <MarkerF
          position={mapCenter}
          icon={{
            url: './images/ripple.svg'
          }}
        />
      </GoogleMap>
    </>
  )
}

export default Map
