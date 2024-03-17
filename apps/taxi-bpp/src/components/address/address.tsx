'use client'

import { LocationIcon } from '@/lib/icons/location-icon'
import React from 'react'
import styles from '../rideStarted/ride-started.module.scss'

function Address({ location }: any) {
  return (
    <div className={styles['loc-RS']}>
      <span className={styles['SourceAddress-RS']}>
        <LocationIcon fill="#80BC48" />
        <p className={`${styles['sub-RS']} ${styles['text-address']}`}>{location.driverAddress}</p>
      </span>
      <span className={styles['MapPin-RS']}>
        {/* <MapPin color="#D22323" className="map-RS" /> */}
        <LocationIcon fill="#D22323" />
        <p className={`${styles['dest-RS']} ${styles['text-address']}`}>{location.pickupAddress}</p>
      </span>
    </div>
  )
}

export default Address
