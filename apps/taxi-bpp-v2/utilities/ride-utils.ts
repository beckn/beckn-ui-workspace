import { PickUpDropOffModel } from '@beckn-ui/common'
import { RideDetailsModel } from '@lib/types/mapScreen'
import { Stop, ValidOrder } from '@lib/types/ride'

export enum RIDE_STATUS_CODE {
  AWAITING_DRIVER_APPROVAL = 'AWAITING_DRIVER_APPROVAL',
  RIDE_ACCEPTED = 'RIDE_ACCEPTED',
  CAB_REACHED_PICKUP_LOCATION = 'CAB_REACHED_PICKUP_LOCATION',
  RIDE_STARTED = 'RIDE_STARTED',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  RIDE_DECLINED = 'RIDE_DECLINED'
}

export const rideStatusMap = {
  RIDE_ACCEPTED: 'On-going',
  CAB_REACHED_PICKUP_LOCATION: 'On-going',
  RIDE_STARTED: 'On-going',
  RIDE_COMPLETED: 'Completed'
}

export const addressFromGps = async (lat: number, long: number) => {
  const latLong = new window.google.maps.LatLng(lat, long)
  const geocoder = new window.google.maps.Geocoder()
  try {
    const response = await geocoder.geocode({ location: latLong })
    if (response.results.length > 0) {
      const { formatted_address } = response.results[0]
      return formatted_address
    } else {
      console.log('No results found')
      return ''
    }
  } catch (error) {
    console.error(error)
  }
}

const getGeoLocation = (list: Stop[], type: 'start' | 'end') => {
  return list
    .filter(element => element.type === type)
    .map(async element => {
      const latLong = element.gps.split(',')
      return {
        address: element.address || (await addressFromGps(Number(latLong[0]), Number(latLong[1]))),
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      } as PickUpDropOffModel
    })[0]
}

function estimateTravelTime(distance: number, speed: number) {
  const timeInSeconds = (distance * 1000) / speed
  const timeInMinutes = timeInSeconds / 60
  return parseInt(timeInMinutes.toString())
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

export const parsedNewRideDetails = async (orderList: ValidOrder[]): Promise<any[]> => {
  try {
    const results = await Promise.all(
      orderList.map(async order => {
        const {
          order_id: { id },
          state_code,
          state_value,
          stops
        } = order

        const pickupLocation: PickUpDropOffModel = await getGeoLocation(stops, 'start')
        const dropoffLocation: PickUpDropOffModel = await getGeoLocation(stops, 'end')

        const distance = getDistance(pickupLocation, dropoffLocation).toFixed(2)
        return {
          orderId: id,
          source: pickupLocation.address,
          sourceGeoLocation: pickupLocation.geoLocation,
          destinationGeoLocation: dropoffLocation.geoLocation,
          destination: dropoffLocation.address,
          distance,
          time: estimateTravelTime(Number(distance), 60),
          driverStatus: state_value
        }
      })
    )

    return results
  } catch (err) {
    console.error('Error in parsed order list:', err)
    throw new Error('error in parsed order list')
  }
}
