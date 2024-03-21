'use client'

import styles from './ride-end.module.scss'
import { setActiveRide } from '@/lib/common.functions'
import { LocalKey, AppRoutes } from '@/lib/constant'
import { getCookie, removeCookie } from '@/lib/CookiesHandler'
import { EndRideData } from '@/lib/driver-data'
import { usePosition } from '@/lib/hooks/usePosition'
import { useRouter } from '@/navigation'
import { round } from 'lodash'
import React, { useEffect } from 'react'
import { MapPin } from 'react-feather'
import CustomMap from '../Map/custom-map'
import DriverAppFooter from '../navFooter/nav-footer'
import { currency } from '../switchButton/switchButton.utils'

const formatDate = (date: any) => {
  return date?.split(' ')[0] || 'NA'
}
function RideEnd() {
  //   const navigate = useNavigate()
  const router = useRouter()

  const { latitude, longitude, error } = usePosition()

  const { res: rideSummary, location, distance } = JSON.parse(getCookie(LocalKey.saveActiveRide)) || null

  useEffect(() => {
    if (!rideSummary) {
      removeCookie(LocalKey.saveActiveRide)
      router.push(AppRoutes.driverDashboard)
    }
    return () => {
      setActiveRide({})
    }
  }, [])
  return (
    <>
      <div className="m-3">
        <h1 className={styles['titleP']}>{EndRideData.title}</h1>
        <p className={styles['subP']}>{EndRideData.Subtitle}</p>
        {/* <h2 className="Rp">
          {currency} {round(rideSummary.SellingPrice) || 0}
        </h2> */}
        <div className={`d-flex mt-3 justify-content-between px-2 ${styles.Rp}`}>
          <h2>{rideSummary?.Passenger?.Name || ''}</h2>
          <h2>
            {currency} {round(rideSummary?.SellingPrice) || 0}
          </h2>
        </div>

        <hr className={styles.hrp} />
        <div className="d-flex mt-5 justify-content-between px-3">
          <h6>{formatDate(rideSummary?.CreatedAt)}</h6>
          <h6>
            Distance : <b>{round(distance) || 0} Kms</b>
          </h6>
        </div>

        {/* <h6 className="tm">{EndRideData.Time}</h6> */}

        <div className="mx-3">
          <span
            title="pickup point"
            className={`d-flex mt-3 align-left gap-4 ${styles['text-address']}`}
          >
            <MapPin fill="#80BC48" />
            {location?.driverAddress}
          </span>
          <span
            title="destination point"
            className={`d-flex mt-3 gap-4 ${styles['text-address']}`}
          >
            <MapPin fill="#D22323" />
            {location?.pickupAddress}
          </span>
        </div>
        <CustomMap
          mapType="end"
          latitude={latitude}
          longitude={longitude}
        />
        <button
          className={`${styles.End} fixed-bottom`}
          onClick={() => router.back()}
        >
          Search Another Ride
        </button>
      </div>
      <DriverAppFooter title="Home" />
    </>
  )
}

export default RideEnd
