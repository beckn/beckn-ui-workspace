import { Coordinate } from '@beckn-ui/common'

export const formatCoords = (coord: Coordinate) => {
  return { lat: coord?.latitude, lng: coord?.longitude }
}

export const formatGeoLocationDetails = (geoLatLong: string): Coordinate => {
  const latLong = geoLatLong.split(',')
  return { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
}
