export interface GeoCoordinate {
  lat: number
  lng: number
}

export interface DynamicGeofenceMapProps {
  enableSearch?: boolean
  editable?: boolean
  polygonPath: GeoCoordinate[]
  city: string
  updateCoordinates: (points: GeoCoordinate[]) => void
}
