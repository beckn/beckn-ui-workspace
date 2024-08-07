import { Coordinate } from '@beckn-ui/common'

export const formatGeoLocationDetails = (geoLatLong: string): Coordinate => {
  const latLong = geoLatLong.split(',')
  return { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
}
