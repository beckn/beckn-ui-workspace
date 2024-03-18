'use client'

import { getRequestData, postRequestData } from '@/lib/apiClient'
import { TripIdFields } from '@/lib/fieldsSet'
import { setActiveRide } from '@/lib/common.functions'

// TODO :- To uncomment this code if this is required in future

// export const getUserVehicles = async (UserId: string) => {
//   let userUrl = `users/show/${UserId}/authorized_drivers`
//   const vehiclesData = await getRequestData(userUrl, null, null)
//   return vehiclesData.data
// }
export const getUserVehicles1 = async (UserId: string) => {
  let userUrl = `users/show/${UserId}/vehicles`
  const vehiclesData = await getRequestData(userUrl, null, null)
  return vehiclesData.data
}
export const getDriverOnline = async (UserId: string) => {
  let path = 'authorized_drivers/login'
  const vehicleData = await getUserVehicles1(UserId)
  const assignedVehicle = vehicleData.Vehicles.filter((vehicle: any) => vehicle.Approved === 'Y')
  const payload = {
    AuthorizedDriver: {
      Vehicle: {
        Id: assignedVehicle[0].Id
      },
      Driver: {
        Id: UserId
      }
    }
  }
  return postRequestData(path, payload, null).then(res => res.data.DriverLogin)
}

export const getTrips = async (id: any, location: any) => {
  const assignedTripPath = `/trips/search?q=DRIVER_LOGIN_ID:${id}+AND+STATUS:Confirmed&maxRecords=1`
  const newPath = `/trips/next/1`
  const path = `driver_logins/updateLocation/${id}`
  const syncDriveLocation = await updateDriverLocation(path, location)
  const tripsData1 = await getRequestData(newPath, TripIdFields, location).then(res => res.data.Trips)
  if (tripsData1 && tripsData1?.length > 0) {
    localStorage.setItem('destId', tripsData1[0].BapId)
  }

  return tripsData1
}
const bppId = 'becknify.humbhionline.in.mobility.BPP/beckn_open/app1-succinct-in'
const bapId = 'mobilityreferencebap.becknprotocol.io'
const getDestinationId = (code: any) => {
  if (code === 'mbth_login' || code === 'mbth_avbl_online') {
    return bppId
  }
  const destId = localStorage.getItem('destId') || undefined
  return destId || bapId
}
export const triggerEvent = async (event_code: any) => {
  const experience_id = localStorage.getItem('expId')
  if (experience_id) {
    let myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const body = JSON.stringify({
      experienceId: experience_id,
      eventCode: event_code,
      eventAction: event_code,
      eventSourceId: bppId,
      eventDestinationId: getDestinationId(event_code),
      payload: 'bpp action',
      eventStart_ts: new Date().toISOString()
    })

    const requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body,
      redirect: 'follow'
    }
    const delayedCall = () => {
      try {
        const res = fetch('https://api.eventcollector.becknprotocol.io/v2/event', requestOptions)
          .then(response => response.text())
          .then(result => {})
          .catch(error => {})
      } catch (error) {
        console.error(error)
      }
    }
    setTimeout(delayedCall, 1000)
  } else {
    return undefined
  }
}
export const acceptRide = (tripId: any, experienceId: any) => {
  const path = `trips/accept/${tripId}`
  return getRequestData(path, null, null)
}

export const rejectRide = (tripId: any, experienceId: any) => {
  const path = `trips/reject/${tripId}`
  return getRequestData(path, null, null)
}

export const startRide = (tripId: any) => {
  const path = `trips/start/${tripId}`
  return getRequestData(path, null, null)
}
export const endRide = (tripId: any) => {
  const path = `trips/end/${tripId}`
  return getRequestData(path, null, null)
}

export const updateDriverLocation = async (driverId: any, location: any) => {
  const path = `driver_logins/updateLocation/${driverId}`
  return getRequestData(path, undefined, location)
}

export const getTripStatus = async (trip: any, location: any) => {
  const path = `trips/show/${trip.Id}`
  const res = await getRequestData(path, null, null).then(res => res.data.Trip)
  setActiveRide({
    res,
    location,
    distance: trip?.TripStops[1]?.DistanceFromLastStop
  })
  return res
}
