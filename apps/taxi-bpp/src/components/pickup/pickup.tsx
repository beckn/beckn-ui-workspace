import React, { useState } from 'react'
import { startRide, endRide } from '../switchButton/driver-services'
import styles from './pickup.module.scss'
import { Button } from 'react-bootstrap'
import { CallLogIcon } from '@/lib/icons/call-log'
import { CarLogIcon } from '@/lib/icons/car-log'
import { LocationIcon } from '@/lib/icons/location-icon'
import { eventCode } from '../switchButton/switchButton.utils'
import { config } from '@/config/config'

function PickUp({ trip, location, sourceLocForPickUpLatLong, destLocForPickUplatLong }: any) {
  const [next, setNext] = useState(false)

  const handleNavigate = async () => {
    if (!next) {
      const baseURL = config.GOOGLE_MAP_DIREC_URL
      const queryParams = `${sourceLocForPickUpLatLong}/${destLocForPickUplatLong}/`
      const finalURL = baseURL + queryParams
      window.open(finalURL, '_blank')
    }

    setNext(true)
    // triggerEvent(eventCode.sendLocation)

    //const res = await startRide(trip.Id).then((response) => response.data);
  }
  return (
    <>
      <>
        <div className={styles['bottomModal-P']}>
          <div className={styles['rectangle-bar-P']}>
            <button className={styles['recbar-P']}>{/* <img src={Rectanglebar} alt="Rectangle bar" /> */}</button>
          </div>
          <div className={styles['nevigate-body-P']}>
            <div
              className={styles['titlle-P']}
              id="example-modal-sizes-title-sm"
            >
              Going for Pickup
            </div>
            <div>
              <div className={styles['carLog-P']}>
                <CarLogIcon />
              </div>
              <div className={styles['callLog-P']}>
                <CallLogIcon />
              </div>
              <h6 className={styles['h6-p']}>Reach pick up location in 5 mins.</h6>
              <br />
              <div className="">
                <br />
                <hr className={styles['hr-p']} />
                <div className={styles['loc-P']}>
                  <LocationIcon fill="#80BC48" />
                </div>
                <div className={styles['sub-P']}>{location.driverAddress}</div>
                <div>
                  <span className={styles['min-P']}>5 min away</span>
                  <span className={styles['kms-P']}>2.5kms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {next ? (
          <div className={styles['bottomModal-P']}>
            <div className={styles['rectangle-bar-P']}>
              <button className={styles['recbar-P']}>{/* <img src={Rectanglebar} alt="Rectangle bar" /> */}</button>
            </div>
            <div className={styles['nevigate-body-P']}>
              <div
                className={styles['titlle-P']}
                id="example-modal-sizes-title-sm"
              >
                Reached Pickup
              </div>
              <div>
                <div className={styles['carLog-P']}>
                  <CarLogIcon />
                </div>
                <div className={styles['callLog-P']}>
                  <CallLogIcon />
                </div>
                <h6 className={styles['h6-p']}>You have Reached pick up location</h6>
                <br />
                <div className="">
                  <br />
                  <hr className={styles['hr-p']} />
                  <div className={styles['loc-P']}>
                    <LocationIcon fill="#80BC48" />
                  </div>
                  <div className={styles['sub-P']}>{location.driverAddress}</div>
                  {/* <div>
                    <span className="min-P hidden">5 min away</span>
                    <span className="kms-P">2.5kms</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </>
      )
      <Button
        onClick={handleNavigate}
        className={`${styles['me-2']} fixed-bottom`}
      >
        {!next ? 'Navigate' : 'Reached Pickup'}
      </Button>
    </>
  )
}

export default PickUp
