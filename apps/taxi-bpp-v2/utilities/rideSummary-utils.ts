import { currencyMap } from '@lib/config'
import { RideDetailsModel } from '@lib/types/mapScreen'
import { CustomerDetails } from '@lib/types/ride'

export interface RideSummaryModalProp {
  orderId: string
  distance: string
  time: string
  date: string
  source: string
  destination: string
  cost: string
  customerDetails: CustomerDetails
}

export const parseRideSummaryData = (data: any, rideDetails: RideDetailsModel): RideSummaryModalProp => {
  const rideSummaryResponse = data?.data?.data
  return {
    orderId: rideSummaryResponse.order_id.id,
    distance: rideDetails.distance!,
    time: rideDetails.time!,
    date: formatDate(rideSummaryResponse.updatedAt),
    source: rideSummaryResponse.stops[0].address,
    destination: rideSummaryResponse.stops[1].address,
    cost: rideSummaryResponse.total_price_in_rs,
    customerDetails: rideDetails.customerDetails
  }
}

// Helper function to format the time
function formatTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Helper function to format the date
function formatDate(dateTime: string): string {
  const date = new Date(dateTime)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${dayName}, ${day}/${month}/${year}`
}

export const getCurrencyValue = (experienceType: string) => {
  const countries = experienceType.split(' ').map(name => name.toLowerCase())
  if (countries.includes('india')) {
    return currencyMap.INR
  }
  if (countries.includes('gambia')) {
    return currencyMap.GMD
  }
  if (countries.includes('france')) {
    return currencyMap.EUR
  }

  return currencyMap.INR
}
