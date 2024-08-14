import React, { useMemo } from 'react'
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api'
import { useTheme } from '@chakra-ui/react'

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
  zoom: 12,
  zoomControl: false
}

interface QuarantineZoneMapProps {
  polygonPath: Array<{ lat: number; lng: number }>
}

const QuarantineZoneMap = (props: QuarantineZoneMapProps) => {
  const { polygonPath } = props

  const theme = useTheme()
  const libraries = useMemo(() => ['places'], [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: libraries as any
  })

  const getPolygonCenter = () => {
    let latSum = 0
    let lngSum = 0

    polygonPath.forEach(point => {
      latSum += point.lat
      lngSum += point.lng
    })

    const latCenter = latSum / polygonPath.length
    const lngCenter = lngSum / polygonPath.length

    return { lat: latCenter, lng: lngCenter }
  }

  return (
    <GoogleMap
      options={mapOptions}
      zoom={12}
      center={getPolygonCenter()}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ maxHeight: '100vh', height: '100vh' }}
    >
      <Polygon
        paths={polygonPath}
        options={{
          fillColor: theme.colors.primary['100'],
          fillOpacity: 0.3,
          strokeColor: 'black',
          strokeOpacity: 1,
          strokeWeight: 2
        }}
      />
    </GoogleMap>
  )
}

export default QuarantineZoneMap
