'use client'

import React, { useEffect, useState, useRef } from 'react'
import { getTripStatus } from '../switchButton/driver-services'
import Pickup from '../pickup/pickup'
import RideStarted from '../rideStarted/ride-started'
import { useInterval } from '@/lib/hooks/useInterval'
import { AppRoutes } from '@/lib/constant'
import { useRouter } from 'next/navigation'
import { usePosition } from '@/lib/hooks/usePosition'

function NavigateButton({ location, trip, rootTripData }: any) {
  const router = useRouter()
  const { DisplayStatus } = trip
  const [ride, setRide] = useState(trip)
  const counter = useRef(0)
  const { latitude, longitude, error } = usePosition()
  counter.current = counter.current + 1

  const getRideData = async () => {
    const res = await getTripStatus(trip, location)
    if (DisplayStatus !== res.DisplayStatus) {
      setRide(res)
    }
  }
  const isActive = ride.DisplayStatus === 'Ended' ? false : true

  useInterval(
    () => {
      getRideData()
    },
    isActive ? 4000 : null
  )

  useEffect(() => {
    if (!isActive) {
      router.push(AppRoutes.endRide)
    }
  }, [ride])

  const sourceLocForPickUpLatLong = `${latitude},${longitude}`

  const sourceLocForStartRideLatLong = `${rootTripData.TripStops[0].Lat},${rootTripData.TripStops[0].Lng}`
  const destLocForStartRidelatLong = `${rootTripData.TripStops[1].Lat},${rootTripData.TripStops[1].Lng}`

  return (
    <>
      {counter.current > 4 ? (
        <RideStarted
          sourceLocForStartRideLatLong={sourceLocForStartRideLatLong}
          destLocForStartRidelatLong={destLocForStartRidelatLong}
          location={location}
          trip={ride}
        />
      ) : (
        <Pickup
          sourceLocForPickUpLatLong={sourceLocForPickUpLatLong}
          destLocForPickUplatLong={sourceLocForStartRideLatLong}
          location={location}
          trip={ride}
        />
      )}
    </>
  )
}

export default NavigateButton
