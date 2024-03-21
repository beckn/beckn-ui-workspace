'use client'

import React, { useState } from 'react'
import styles from './ready-to-start.module.scss'
import { MapPin } from 'react-feather'
import { Button } from 'react-bootstrap'
import { CallLogIcon } from '@/lib/icons/call-log'
import { CarLogIcon } from '@/lib/icons/car-log'
import { LocationIcon } from '@/lib/icons/location-icon'
import { ReadyStartData } from '@/lib/driver-data'

function ReadyStart() {
  const [smShow, setSmShow] = useState(false)

  return (
    <>
      {smShow ? (
        <div className={styles['bottomModal-R']}>
          <div
            className={styles['rectangle-bar-R']}
            onClick={() => setSmShow(!smShow)}
          >
            <button className={styles['recbar-R']}>
              <img
                src={'/rectangle-bar.png'}
                alt="Rectangle bar"
              />
            </button>
          </div>
          <div className={styles['nevigate-body-R']}>
            <div>
              <div>
                <div
                  className={styles['titlle-R']}
                  id="example-modal-sizes-title-sm"
                >
                  {ReadyStartData.title}
                </div>
                <div className={styles['carLog-R']}>
                  <CarLogIcon />
                </div>
                <div className={styles['callLog-R']}>
                  <CallLogIcon />
                </div>
                <h6 className={styles['h6-R']}>{ReadyStartData.Subtitle}</h6>
              </div>

              <div>
                <hr className={styles['hr-R']} />
              </div>

              <div className={styles['loc-R']}>
                <span className={styles['SourceAddress-R']}>
                  <LocationIcon />
                  <p className={styles['sub-R']}>{ReadyStartData.Location}</p>
                </span>
                <span className={styles['MapPin-R']}>
                  <MapPin
                    color="#D22323"
                    className={styles['map-R']}
                  />
                  <p className={styles['dest-R']}>{ReadyStartData.Address}</p>
                </span>
              </div>

              <hr className={styles['hrs-R']} />
              <h6 className={styles['hd-R']}>{ReadyStartData.TotalRide} :</h6>
              <h6 className={styles['rs-R']}>{ReadyStartData.Amount}</h6>
              <p className={styles['ps-R']}>{ReadyStartData.Colletion}</p>
              <hr className={styles['Cancelridehr-R']} />
              <h6 className={styles['ride-R']}>{ReadyStartData.Ride}</h6>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Button
        onClick={() => setSmShow(!smShow)}
        className={`${styles['me-2']} ${styles['fixed-bottom']}`}
      >
        Start Ride
      </Button>
      {/*<Modal
        className="popup"
        size="md"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
      <Modal.Title className="titlle" id="example-modal-sizes-title-sm">
        {ReadyStartData.title}
        </Modal.Title>
        <Modal.Body>
          <div className="carLog">
            <CarLogIcon />
          </div>
          <div className="callLog">
            <CallLogIcon />
          </div>
          <h6 className="h6">{ReadyStartData.Subtitle}</h6>
          <hr className="hr" />
          <div className="loc">
            <LocationIcon />
            <span className="MapPin">
        <MapPin color="#D22323" className="map" />
      {ReadyStartData.Address}
      </span>
          </div>
          <p className="sub">{ReadyStartData.Location}</p>
          <hr className="hrs" />
          <h6 className="hd">{ReadyStartData.TotalRide}</h6>
          <h6 className="rs">{ReadyStartData.Amount}</h6>
          <p className="ps">{ReadyStartData.Colletion}</p>
          <h6 className="ride">{ReadyStartData.Ride}</h6>
        </Modal.Body>
      </Modal>*/}
    </>
  )
}

export default ReadyStart
