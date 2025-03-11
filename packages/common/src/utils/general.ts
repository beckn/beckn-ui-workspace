import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Coordinate } from '../../lib/types'
import { format } from 'date-fns'
import jwt from 'jsonwebtoken'

export const toBinary = (objectString: string) => {
  const codeUnits = Uint16Array.from({ length: objectString.length }, (element, index) =>
    objectString.charCodeAt(index)
  )
  const charCodes = new Uint8Array(codeUnits.buffer)

  let result = ''
  charCodes.forEach(char => {
    result += String.fromCharCode(char)
  })
  return result
}

export const fromBinary = (binary: string) => {
  const bytes = Uint8Array.from({ length: binary.length }, (element, index) => binary.charCodeAt(index))
  const charCodes = new Uint16Array(bytes.buffer)

  let result = ''
  charCodes.forEach(char => {
    result += String.fromCharCode(char)
  })
  return result
}

export const areObjectPropertiesEqual = (obj1: ShippingFormInitialValuesType, obj2: ShippingFormInitialValuesType) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (obj1[key as keyof ShippingFormInitialValuesType] !== obj2[key as keyof ShippingFormInitialValuesType]) {
      return false
    }
  }

  return true
}

export function isEmpty(value: string | any[] | Date | Function | Record<string, any> | null | undefined): boolean {
  if (value == null) return true

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Date || typeof value === 'function') {
    return false
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

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

export function formatDate(date: string | number | Date, formatType: string): string {
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date')
    }

    return format(parsedDate, formatType)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export const checkTokenExpiry = (token: any) => {
  const decoded: any = jwt.decode(token) // Just decodes, no verification

  if (decoded && decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime > decoded.exp) {
      console.log('Token has expired')
      return true
    }
  }
  return false
}
