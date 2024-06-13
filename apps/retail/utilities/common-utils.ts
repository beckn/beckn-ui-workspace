import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'

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
