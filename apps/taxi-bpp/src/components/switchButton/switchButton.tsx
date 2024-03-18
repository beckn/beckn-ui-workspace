/* eslint-disable no-undef */
'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import styles from './switchButton.module.scss'
import { toast } from 'react-toastify'
import CustomSwitch from './customSwitch'
import CustomModal from '../Modal/Modal'
import AlertModal from '../Modal/alert'
import NavigateButton from '../navigate/navigate-button'
import { getCookie } from '@/lib/CookiesHandler'
import { LocalKey } from '@/lib/constant'
import { getDriverOnline, getTrips, acceptRide, rejectRide } from './driver-services'
import { OfflineModalContent, RideRequest, AlertModalContent } from './modal-content'
import { useAddress } from '@/lib/hooks/useAddress'
import { eventCode, getOriginAndDestination } from './switchButton.utils'

//get experience id
const getExperienceId = (experience_id: string) => {
  if (experience_id) {
    const exp_id = experience_id.split('.')[1]
    localStorage.setItem('expId', exp_id)
    return experience_id.split('.')[1]
  } else {
    return undefined
  }
}

const SwitchButton = ({ latitude, longitude, setLocations }: any) => {
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null
  // const { res: rideSummary, location: savedLocation } =
  //   JSON.parse(getCookie(LocalKey.saveActiveRide)) || null;
  const [value, setValue] = useState(false)
  const [alertModalShow, setAlertModal] = useState(false)
  const [modalShow, setModalShow] = useState(true)
  const [rideModalShow, setRideModalShow] = useState(value)
  const [driverLoginId, setDriverLoginId] = useState()

  const [trip, setTrip] = useState<any>(undefined)
  const { driverAddress, pickupAddress } = useAddress(trip)

  const [rideStatus, setRideStatus] = useState({
    accept: false,
    reject: false
  })
  const experienceId = getExperienceId(trip?.TransactionId)
  const getOnline = async () => {
    const loginDetails = await getDriverOnline(User.Id)
    toast.info('Looking for ride', {
      autoClose: 2000
    })
    //triggerEvent(experienceId);
    if (loginDetails) {
      setDriverLoginId(loginDetails.Id)
      //   triggerEvent(eventCode.driverOnline)
    }
  }

  const toggleSwitch = (val: any) => {
    setValue(val)
    localStorage.setItem(LocalKey.saveDriverStatus, JSON.stringify({ status: val, id: driverLoginId }))
  }
  const handleSwitch = async () => {
    if (latitude == null || longitude == null) {
      //alert("please enable your location")
      toggleSwitch(false)
      setAlertModal(!alertModalShow)
    } else {
      toggleSwitch(!value)
      value && setModalShow(!modalShow)
      try {
        if (!value) {
          getOnline()
        }
      } catch (err) {
        toast.error('Something Went wrong')
        toggleSwitch(false)
      }
    }
  }

  const handleAccept = useCallback(async (id: any) => {
    setRideModalShow(false)
    const res = await acceptRide(id, experienceId)
    // triggerEvent(eventCode.acceptRide)
    setRideStatus({ accept: true, reject: false })
  }, [])

  const handleReject = useCallback(async (id: any) => {
    const res = await rejectRide(id, experienceId)
    setRideStatus({ accept: false, reject: true })
    setRideModalShow(false)
    toggleSwitch(false)
    setLocations([])
  }, [])

  useEffect(() => {
    let rideData
    let timerRef: any
    let counter = 0
    if (value && driverLoginId) {
      timerRef = setInterval(async () => {
        // do stuff here
        counter = counter + 1
        if (counter === 40) {
          clearInterval(timerRef)
          toast.error('No trips found in this location')
          localStorage.setItem(LocalKey.saveDriverStatus, JSON.stringify({ status: false, id: '' }))
          setValue(false)
        }
        rideData = await getTrips(driverLoginId, {
          latitude,
          longitude
        })
        if (rideData.length === 1) {
          setTrip(rideData[0])
          setLocations(getOriginAndDestination(rideData[0]))
          setRideModalShow(!rideModalShow)
          clearInterval(timerRef)
        } else {
          //toast.error("Oops..!  No Trips Found in your area");
        }
      }, 4000)
    }
    return () => {
      clearInterval(timerRef)
    }
  }, [driverLoginId, value])

  useEffect(() => {
    if (localStorage && localStorage.getItem(LocalKey.saveDriverStatus)) {
      const items = JSON.parse(localStorage.getItem(LocalKey.saveDriverStatus) as string) || null
      if (items?.status && latitude) {
        getOnline()
        setValue(true)
      }
    }
  }, [latitude])

  return (
    <div className="">
      <div>
        <h2 className={styles.title}>{User.LongName || ''}</h2>
        <h3 className={styles.text}>{User?.Company?.Name || ''}</h3>
      </div>
      {
        <CustomSwitch
          isOn={value}
          handleToggle={handleSwitch}
        />
      }

      {!value && (
        <CustomModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <OfflineModalContent />
        </CustomModal>
      )}
      {rideModalShow && value && (
        <CustomModal
          show={rideModalShow}
          //onHide={() => setRideModalShow(false)}
        >
          <RideRequest
            onAccept={handleAccept}
            onReject={handleReject}
            rideStatus={rideStatus}
            trip={trip}
            address={{
              driverAddress,
              pickupAddress
            }}
          />
        </CustomModal>
      )}
      <AlertModal
        show={alertModalShow}
        onHide={() => setAlertModal(false)}
      >
        <AlertModalContent />
      </AlertModal>
      {rideStatus.accept && value && (
        <div className="fixed-bottom">
          <NavigateButton
            rootTripData={trip}
            location={{ driverAddress, pickupAddress }}
            trip={trip}
          />
        </div>
      )}
    </div>
  )
}

export default SwitchButton
