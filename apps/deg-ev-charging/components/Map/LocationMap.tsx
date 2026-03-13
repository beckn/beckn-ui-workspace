import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface StationMarker {
  id: string
  markerKey: string
  lat: number
  lng: number
  name?: string
}

interface LocationMapProps {
  center: { lat: number; lng: number }
  stations: StationMarker[]
  selectedStationId: string | null
  onStationClick: (station: StationMarker) => void
}

function SetViewOnChange({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom())
  }, [center.lat, center.lng, map])
  return null
}

function createStationIcon(markerKey: string): L.DivIcon {
  return L.divIcon({
    className: 'ev-station-marker',
    html: `<div class="ev-station-marker-hit" data-marker-key="${markerKey}" style="width:24px;height:24px;border-radius:50%;background:var(--ev-primary,#54b86a);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);pointer-events:auto;cursor:pointer;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const centerIcon = new L.DivIcon({
  className: 'ev-center-marker',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#333;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

/** Renders station markers and handles click via map click delegation (works when marker click is blocked) */
function StationMarkersLayer({
  stations,
  onStationClick
}: {
  stations: StationMarker[]
  onStationClick: (station: StationMarker) => void
}) {
  const map = useMap()
  const layerRef = useRef<L.LayerGroup | null>(null)
  const onStationClickRef = useRef(onStationClick)
  const stationsRef = useRef<StationMarker[]>(stations)
  onStationClickRef.current = onStationClick
  stationsRef.current = stations

  useEffect(() => {
    if (!map) return
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }
    const group = L.layerGroup().addTo(map)
    layerRef.current = group
    for (const station of stations) {
      const marker = L.marker([station.lat, station.lng], {
        icon: createStationIcon(station.markerKey),
        zIndexOffset: 1001
      })
      marker.on('click', () => {
        onStationClickRef.current(station)
      })
      marker.addTo(group)
    }
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [map, stations])

  useEffect(() => {
    if (!map || stations.length === 0) return
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const target = (e.originalEvent?.target as HTMLElement) || null
      if (!target) return
      const hitEl = target.closest?.('[data-marker-key]')
      if (!hitEl) return
      const key = hitEl.getAttribute?.('data-marker-key')
      if (!key) return
      const station = stationsRef.current.find(s => s.markerKey === key)
      if (station) onStationClickRef.current(station)
    }
    map.on('click', handleMapClick)
    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, stations.length])

  return null
}

const LocationMap: React.FC<LocationMapProps> = ({ center, stations, selectedStationId, onStationClick }) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '100%', minHeight: '300px', width: '100%', pointerEvents: 'auto' }}
      scrollWheelZoom
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewOnChange center={center} />
      <Marker
        position={[center.lat, center.lng]}
        icon={centerIcon}
        zIndexOffset={1000}
      />
      <StationMarkersLayer
        stations={stations}
        onStationClick={onStationClick}
      />
    </MapContainer>
  )
}

export default LocationMap
