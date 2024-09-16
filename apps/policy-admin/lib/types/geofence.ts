export interface GeoCoordinate {
  lat: number
  lng: number
}

export interface DynamicGeofenceMapProps {
  enableSearch?: boolean
  editable?: boolean
  polygonPath: GeoCoordinate[]
  focusedPosition?: GeoCoordinate
  updateCoordinates: (points: GeoCoordinate[]) => void
}
