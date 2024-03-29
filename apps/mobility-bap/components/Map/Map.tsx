import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet'
import { Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Control from 'react-leaflet-custom-control'
import 'leaflet/dist/leaflet.css'
import CenterMarker from './CenterMarker.svg'
import L from 'leaflet'

interface MapProps {
  coords: { lat: number; long: number }
}

const Map: React.FC<MapProps> = ({ coords }) => {
  const { lat, long } = coords
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [flyToUserLocation, setFlyToUserLocation] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation([position.coords.latitude, position.coords.longitude])
      },
      error => {
        console.error('Error getting user location:', error)
      }
    )
  }, [])

  const ZoomToUserLocation = () => {
    let map = useMap()

    if (userLocation && flyToUserLocation) {
      map.flyTo(userLocation, 12)
    }

    return null
  }

  const customCenterMarker = new L.Icon({
    iconUrl: CenterMarker,
    iconSize: [40, 50],
    iconAnchor: [5, 30]
  })

  function MapView() {
    let map = useMap()
    map.setView([lat, long], map.getZoom())
    return null
  }

  return (
    <MapContainer
      style={{ maxHeight: '100vh', height: '90vh' }}
      center={[lat, long]}
      zoom={16}
      zoomControl={false}
      scrollWheelZoom={true}
      zoomAnimation={true}
    >
      <TileLayer
        attribution="&copy; contributors"
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&s=Galileo"
      />
      <Control
        prepend
        position="topright"
      >
        <div className="flex flex-col basis-4">
          <Image
            className="translate-x-0.5"
            onClick={() => setFlyToUserLocation(true)}
            src="/images/LocateMe.svg"
            alt="..."
          />
        </div>
      </Control>
      <Marker
        icon={customCenterMarker}
        position={[lat, long]}
      ></Marker>
      <ZoomControl position="topright" />

      <MapView />
      <ZoomToUserLocation />
    </MapContainer>
  )
}

export default React.memo(Map, (prevProps, nextProps) => {
  if (prevProps.coords.lat === nextProps.coords.lat && prevProps.coords.long === nextProps.coords.long) {
    return true
  }
  return false
})
