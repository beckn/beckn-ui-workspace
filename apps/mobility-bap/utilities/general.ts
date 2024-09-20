import { PickUpDropOffModel } from '@beckn-ui/common'
import { currencyMap, defaultSourceLocation } from '@lib/config'
import { policyStatusMap } from '@lib/constant'

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
