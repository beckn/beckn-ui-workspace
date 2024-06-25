import { Coordinate } from '@beckn-ui/common/lib/types'

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371

  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}
