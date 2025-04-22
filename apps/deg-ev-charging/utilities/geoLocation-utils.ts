import { Coordinate, PickUpDropOffModel } from '@beckn-ui/common'

export const formatCoords = (coord: Coordinate) => {
  return { lat: coord?.latitude, lng: coord?.longitude }
}

export const formatGeoLocationDetails = (address: string, geoLatLong: string): PickUpDropOffModel => {
  const latLong = geoLatLong.split(',')
  return {
    address: address,
    geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
  }
}
