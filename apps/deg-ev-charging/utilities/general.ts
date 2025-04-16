import { PickUpDropOffModel } from '@beckn-ui/common'
import { currencyMap, defaultSourceLocation } from '@lib/config'
import { policyStatusMap } from '@lib/constant'
import { DocumentPayload } from '@lib/types/becknDid'
import Cookies from 'js-cookie'

const getError = (err: any) =>
  err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message

export { getError }

export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

export enum RIDE_STATUS_CODE {
  AWAITING_DRIVER_APPROVAL = 'AWAITING_DRIVER_APPROVAL',
  RIDE_ACCEPTED = 'RIDE_ACCEPTED',
  CAB_REACHED_PICKUP_LOCATION = 'CAB_REACHED_PICKUP_LOCATION',
  RIDE_STARTED = 'RIDE_STARTED',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  RIDE_DECLINED = 'RIDE_DECLINED'
}

export const groupDataBy = (data: any[], groupBy: string) => {
  const groupedData = data.reduce((acc, ele) => {
    const attributes = ele.attributes
    const pp_actionsAttributes = attributes?.pp_actions?.data?.[0]?.attributes?.action || undefined
    const status = policyStatusMap[pp_actionsAttributes || attributes[groupBy]].toLowerCase()
    if (!acc[status]) {
      acc[status] = []
    }

    acc[status].push({
      id: attributes.policyId,
      description: attributes.short_description,
      type: attributes.type,
      name: attributes.name,
      domain: attributes.domain,
      country: attributes.coverage[0].spatial[0].country,
      city: attributes.coverage[0].spatial[0].city,
      startDate: attributes.coverage[0].temporal[0].range.start,
      endDate: attributes.coverage[0].temporal[0].range.end,
      applicableTo: attributes?.coverage[0]['subscribers']?.map((item: { type: any }) => item.type).join(', '),
      owner: attributes?.rules?.message?.policy?.owner?.descriptor.name,
      polygon: attributes?.geofences?.[0]['polygon'] || [],
      status: policyStatusMap[attributes?.pp_actions?.data?.[0]?.attributes?.action || attributes.status],
      policyDocuments: attributes?.mediaUrl || attributes?.rules?.message?.policy?.descriptor?.media?.[0]?.url
    })
    return acc
  }, {})

  return groupedData
}

export const getExperienceTypeGelocation = (experienceType: string) => {
  if (experienceType === 'smartCity') {
    return defaultSourceLocation.smartCity
  }
  if (experienceType === 'gambia') {
    return defaultSourceLocation.gambia
  }
  if (experienceType === 'paris') {
    return defaultSourceLocation.paris
  }

  return null
}

export const getCurrencyWithFare = (experienceType: string, fare: string) => {
  if (!experienceType) return
  const countries = experienceType?.split(' ').map(name => name.toLowerCase())
  if (countries.includes('india')) {
    return `${currencyMap.INR}${fare || 0}`
  }
  if (countries.includes('gambia')) {
    return `${currencyMap.GMD}${fare || 0}`
  }
  if (countries.includes('france')) {
    return `${fare || 0}${currencyMap.EUR}`
  }

  return `${currencyMap.INR}${fare || 0}`
}

export const getDistance = (sourceCoordinates: PickUpDropOffModel, destinationCoordinates: PickUpDropOffModel) => {
  const sourceLat = (parseFloat(sourceCoordinates.geoLocation.latitude.toString()) * Math.PI) / 180
  const sourceLong = (parseFloat(sourceCoordinates.geoLocation.longitude.toString()) * Math.PI) / 180
  const destinatonLat = (parseFloat(destinationCoordinates.geoLocation.latitude.toString()) * Math.PI) / 180
  const destinationLong = (parseFloat(destinationCoordinates.geoLocation.longitude.toString()) * Math.PI) / 180

  let deltaLong = destinationLong - sourceLong
  let deltaLat = destinatonLat - sourceLat
  let a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(sourceLat) * Math.cos(destinatonLat) * Math.pow(Math.sin(deltaLong / 2), 2)

  let c = 2 * Math.asin(Math.sqrt(a))

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371

  // calculate the result
  return c * r
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export const getMaskedMobileNumber = (phoneNumber: string) => {
  return `${phoneNumber.slice(0, 2)}XXXX${phoneNumber.slice(-3)}`
}

export const extractMobileNumberFromSubjectDid = (subject: string) => {
  if (!subject && subject === '') return
  const didRegex = /\/subjects\/(?:users|phone)\/phone\/(\d+)/
  const match = subject.match(didRegex)

  return match?.[1]
}

export const toSnakeCase = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '_')
}

export const toBase64 = (inputString: string): string => {
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(inputString)))
  } else {
    return Buffer.from(inputString, 'utf-8').toString('base64')
  }
}

export const fromBase64 = (base64String: string): string => {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(atob(base64String)))
  } else {
    return Buffer.from(base64String, 'base64').toString('utf-8')
  }
}

export const extractAuthAndHeader = (
  inputString: string
): { authorization: string | null; payload: DocumentPayload } => {
  const authMatch = inputString.match(/Authorization=(.*?),\s*payload/)
  const payloadMatch = inputString.match(/payload=(.*?})\s*}/)
  if (authMatch && authMatch?.length > 0 && payloadMatch && payloadMatch?.length > 0) {
    const authorization = authMatch?.[1].trim()
    const payload: any = payloadMatch?.[1]

    return { authorization: authorization!, payload: payload }
  } else {
    return { authorization: null, payload: { name: '', stream: '' } }
  }
}

export const filterByKeyword = (data: any[], keyword: string, searchBy: string): any[] => {
  if (!keyword.trim()) return data

  return data.filter(item => item[searchBy].toLowerCase().includes(keyword.toLowerCase()))
}

export const validateStartEndTime = (startTime: Date, endTime: Date): boolean => {
  return startTime.getTime() < endTime.getTime()
}

export const currencyFormat = (price: number | undefined) => {
  return price ? new Intl.NumberFormat('en-GB').format(price) : null
}

export const generateRandomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const formatTime = (timestamp: number | null) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// Add this helper function to round up time to nearest hour
export const roundToNextHour = (date: Date) => {
  const roundedDate = new Date(date)
  // If minutes are not 0, round up to next hour
  if (roundedDate.getMinutes() > 0) {
    roundedDate.setHours(roundedDate.getHours() + 1)
  }
  roundedDate.setMinutes(0)
  roundedDate.setSeconds(0)
  roundedDate.setMilliseconds(0)
  return roundedDate
}

export const getCountryCode = (): { country: { name: string; code: string } } => {
  const countryCode = Cookies.get('country_code')
  return countryCode ? JSON.parse(countryCode) : { country: { name: 'United States', code: 'USA' } }
}
