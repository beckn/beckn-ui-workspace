'use client'

import { AppRoutes, LocalKey } from '@/lib/constant'
import { getCookie, setCookie } from '@/lib/CookiesHandler'
import { usePosition } from '@/lib/hooks/usePosition'
import { useRouter } from '@/navigation'
import React, { useState, useEffect } from 'react'
import DriverAppHeader from '../header/header'
import CustomMap from '../Map/custom-map'
import DriverAppFooter from '../navFooter/nav-footer'
import SwitchButton from '../switchButton/switchButton'

function DriverDashboard() {
  const [locations, setLocations] = useState()

  const router = useRouter()
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null
  const isVerified = User?.Approved === 'Y' ? true : false

  const { latitude, longitude, error } = usePosition()
  const init = () => {
    document.title = `Driver App`
  }
  useEffect(() => {
    setCookie(LocalKey.saveActiveRide, JSON.stringify({}))
    init()
    if (!isVerified) {
      router.push(AppRoutes.accountRegistration)
    }
  }, [])
  return (
    <div>
      <div>
        <DriverAppHeader title={'Home'} />
        <div>
          <div className="radio fixed-top">
            <SwitchButton
              latitude={latitude}
              longitude={longitude}
              setLocations={setLocations}
            />
          </div>
          <CustomMap
            latitude={latitude}
            longitude={longitude}
            locations={locations}
          />
          {/*<div className="fixed-bottom">
            <NavigateButton />
          </div>*/}
        </div>
        <DriverAppFooter title="Home" />
      </div>
    </div>
  )
}

export default DriverDashboard
