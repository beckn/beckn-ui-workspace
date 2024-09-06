export interface GeoCoordinate {
  lat: number
  lng: number
}

export interface DynamicGeofenceMapProps {
  polygonPath: GeoCoordinate[]
  updateCoordinates: (points: GeoCoordinate[]) => void
  handleMapClick: (event: google.maps.MapMouseEvent) => void
}
