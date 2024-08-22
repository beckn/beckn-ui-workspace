import { currencyMap, defaultSourceLocation } from '@lib/config'

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
    const status = ele[groupBy].toLowerCase()
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(ele)
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

export const getCurrencyValue = (experienceType: string) => {
  if (experienceType === 'smartCity') {
    return currencyMap.INR
  }
  if (experienceType === 'gambia') {
    return currencyMap.GMD
  }
  if (experienceType === 'paris') {
    return currencyMap.EUR
  }

  return currencyMap.INR
}
