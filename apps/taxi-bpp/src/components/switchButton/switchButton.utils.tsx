export const getOriginAndDestination = (trips: any) => {
  return [
    {
      Lat: trips?.TripStops[0].Lat,
      Lng: trips?.TripStops[0].Lng
    },
    {
      Lat: trips?.TripStops[1].Lat,
      Lng: trips?.TripStops[1].Lng
    }
  ]
}

export function getAge(dateString: string) {
  if (dateString.length < 10) return false
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  let m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age > 18 ? true : false
}

const currencyMapping = {
  Rupees: '₹',
  EURO: '€'
}
export const currency = currencyMapping.Rupees

export const eventCode = {
  login: 'mbth_login',
  driverOnline: 'mbth_avbl_online',
  acceptRide: 'mbth_accept_ride',
  sendLocation: 'mbth_crrnt_loc',
  startRide: 'mbth_strt_ride',
  endRide: 'mbth_end_ride'
}

export function round(num: any, dp = 2) {
  const numToFixedDp = Number(num).toFixed(dp)
  return Math.round(Number(numToFixedDp || 0)) || 0
}
