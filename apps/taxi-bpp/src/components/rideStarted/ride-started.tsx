'use client'

import React, { useState } from 'react'
import styles from './ride-started.module.scss'
import readyToStartStyles from '../readyToStart/ready-to-start.module.scss'
import { Button } from 'react-bootstrap'
import { ReadyStartData, RideStartedData } from '@/lib/driver-data'
import { CallLogIcon } from '@/lib/icons/call-log'
import { CarLogIcon } from '@/lib/icons/car-log'
import { startRide, triggerEvent, endRide } from '../switchButton/driver-services'
import { currency, eventCode, round } from '../switchButton/switchButton.utils'
import Address from '../address/address'
import { config } from '@/config/config'

function RideStarted({ trip, location, sourceLocForStartRideLatLong, destLocForStartRidelatLong }: any) {
  const [smShow, setSmShow] = useState<any>({ status: false, data: undefined })
  const [rideDetail, setRideDetail] = useState(false)
  const handleStartRide = async () => {
    const baseURL = config.GOOGLE_MAP_DIREC_URL
    const queryParams = `${sourceLocForStartRideLatLong}/${destLocForStartRidelatLong}/`
    const finalURL = baseURL + queryParams

    window.open(finalURL, '_blank')

    const res = await startRide(trip.Id).then(response => response.data)
    setSmShow({ status: !smShow.status, data: res.Trip })
    // triggerEvent(eventCode.startRide)
  }
  const handleEndRide = async () => {
    !isTripEnded &&
      (await endRide(trip.Id).then(response => {
        triggerEvent(eventCode.endRide)
        return response
      }))
    //setSmShow({ status: !smShow.status, data: res.Trip });
    isTripEnded && window.location.reload()
  }
  const status = smShow.data ? smShow.data.DisplayStatus : 'Not Confirmed'
  const isTripEnded = trip.DisplayStatus === 'Ended' ? true : false

  return (
    <>
      {smShow.status ? (
        <div className={styles.bottomModal}>
          <div
            className={styles['rectangle-bar']}
            onClick={() => setRideDetail(!rideDetail)}
          >
            <button className={styles['recbar']}>
              <img
                src={'/rectangle-bar.png'}
                alt="Rectangle bar"
              />
            </button>
          </div>
          <div
            className={styles['titlle']}
            id="example-modal-sizes-title-sm"
          >
            {!isTripEnded ? RideStartedData.title : 'Ride Completed'}
          </div>
          <div>
            <div
              className={styles['titlle-text']}
              id="example-modal-sizes-title-sm"
            >
              {!isTripEnded ? (
                <span>
                  You are on your way towards <br /> the drop locations
                </span>
              ) : (
                'You have reached the destination.'
              )}
            </div>
          </div>
          {!isTripEnded && (
            <>
              <div className={styles['carLog']}>
                <CarLogIcon />
              </div>
              <div className={styles['callLog']}>
                <CallLogIcon />
              </div>
            </>
          )}
          <RideStartedExpand
            rideDetail={rideDetail}
            trip={trip}
            setRideDetail={setRideDetail}
            location={location}
          />
        </div>
      ) : (
        <div></div>
      )}
      {status === 'Not Confirmed' ? (
        <Button
          onClick={handleStartRide}
          className={`${styles['me-2']} ${styles['fixed-bottom']}`}
        >
          Start Ride
        </Button>
      ) : (
        <Button
          onClick={handleEndRide}
          className={`${styles['me-2']} ${styles['fixed-bottom']}`}
        >
          {isTripEnded ? 'Ride Ended' : 'End Ride'}
        </Button>
      )}
    </>
  )
}

export default RideStarted

function RideStartedExpand({ rideDetail, setRideDetail, location, trip }: any) {
  // if (trip.DisplayStatus === "Ended") {
  //   return (
  //     <>
  //       <RideEnd />
  //     </>
  //   );
  // }

  return (
    <>
      {rideDetail ? (
        <div className={readyToStartStyles['bottomModal-R']}>
          <div
            className={readyToStartStyles['rectangle-bar-R']}
            onClick={() => setRideDetail(false)}
          >
            <button className={readyToStartStyles['recbar-R']}>
              <img
                src={'/rectangle-bar.png'}
                alt="Rectangle bar"
              />
            </button>
          </div>
          <div className={readyToStartStyles['nevigate-body-R']}>
            <div>
              <div>
                <div
                  className={readyToStartStyles['titlle-R']}
                  id="example-modal-sizes-title-sm"
                >
                  {RideStartedData.title}
                </div>
                <div className={readyToStartStyles['carLog-R']}>
                  <CarLogIcon />
                </div>
                <div className={readyToStartStyles['callLog-R']}>
                  <CallLogIcon />
                </div>
                <h6 className={readyToStartStyles['h6-R']}>
                  <div>You are on your way towards</div>
                  the drop locations
                </h6>
              </div>

              <div>
                <hr className={styles['hr-RS']} />
              </div>

              <Address location={location} />

              <hr className={styles['hrs-RS']} />
              <h6 className={styles['hd-RS']}>{ReadyStartData.TotalRide} :</h6>
              <h6 className={styles['rs-RS']}>
                {currency} {round(trip.SellingPrice || ReadyStartData.Amount)}
              </h6>
              <p className={styles['ps-RS']}>{ReadyStartData.Colletion}</p>
              <hr className={styles['Cancelridehr-RS']} />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}
