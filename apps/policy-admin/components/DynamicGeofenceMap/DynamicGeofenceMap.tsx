import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Polygon,
  Autocomplete,
  MarkerF,
  useLoadScript
} from '@react-google-maps/api'
import { useRouter } from 'next/router'
import { cityCoordinates } from '@utils/geoLocation'
import { DynamicGeofenceMapProps } from '@lib/types/geofence'
import { Input } from '@chakra-ui/react'

type Coords = {
  lat: number
  long: number
}

const autoCompleteInputStyle: React.CSSProperties = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: 'absolute',
  left: '50%',
  marginTop: '12px',
  marginLeft: '-120px',
  backgroundColor: '#fff'
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209
}

const DynamicGeofenceMap = (props: DynamicGeofenceMapProps) => {
  const { enableSearch = true, editable = true, polygonPath, updateCoordinates } = props
  const [autocomplete, setAutocomplete] = React.useState(null)
  const [libraries] = useState(['places', 'drawing'])

  const router = useRouter()
  console.log(props.city)
  const city = props.city || 'bangalore'
  const cityLatLng = cityCoordinates[city as string] ||
    polygonPath[0] || {
      lat: 12.903561,
      lng: 77.5939631
    }

  const [focusedMapPosition, setFocusedMapPosition] = useState(cityLatLng)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: libraries as any
  })

  const onAutoCompleteLoad = (autocomplete: any) => [setAutocomplete(autocomplete)]

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = (autocomplete as any).getPlace()
      setFocusedMapPosition(place.geometry.location.toJSON())
    } else {
      alert('Autocomplete is not loaded yet!')
    }
  }

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon
      .getPath()
      .getArray()
      .map((latLng: google.maps.LatLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng()
      }))

    updateCoordinates(path)

    polygon.setMap(null)
  }, [])

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={focusedMapPosition || defaultCenter}
          zoom={14}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {editable && <MarkerF position={focusedMapPosition} />}

          {editable && (
            <DrawingManager
              onPolygonComplete={onPolygonComplete}
              drawingMode={google.maps.drawing.OverlayType.POLYGON}
              options={{
                drawingControl: false,
                drawingControlOptions: {
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                },
                polygonOptions: {
                  fillColor: 'red',
                  fillOpacity: 0.2,
                  strokeColor: 'red',
                  strokeOpacity: 0.5,
                  strokeWeight: 2,
                  editable: editable,
                  draggable: false
                }
              }}
            />
          )}

          {polygonPath?.length > 0 && (
            <Polygon
              paths={polygonPath}
              options={{
                strokeColor: '#000000',
                fillColor: '#01326A',
                strokeOpacity: 0.8,
                fillOpacity: 0.35,
                strokeWeight: 2
              }}
              editable={editable}
            />
          )}

          {enableSearch && (
            <Autocomplete
              onLoad={onAutoCompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <Input
                type="text"
                placeholder="Enter a location"
                style={autoCompleteInputStyle}
              />
            </Autocomplete>
          )}
        </GoogleMap>
      )}
    </>
  )
}

export default DynamicGeofenceMap
