// @ts-nocheck
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api'
import { useMemo } from 'react'

interface MapProps {
  coordinates: { latitude: number; longitude: number }
}

const Map = ({ coordinates }: MapProps) => {
  const { latitude, longitude } = coordinates || {}
  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(() => ({ lat: latitude, lng: longitude }), [coordinates])

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true
    }),
    []
  )
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: libraries as any
  })

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <>
      <GoogleMap
        options={mapOptions}
        zoom={16}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
      >
        <MarkerF
          position={mapCenter}
          // icon={{
          //   url: './images/ripple.svg'
          // }}
        />
      </GoogleMap>
    </>
  )
}

export default Map
