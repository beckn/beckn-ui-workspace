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

        return {
          orderId: id,
          source: pickupLocation.address,
          sourceGeoLocation: pickupLocation.geoLocation,
          destinationGeoLocation: dropoffLocation.geoLocation,
          destination: dropoffLocation.address,
          distance: `5 kms`,
          time: '5 min away',
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
