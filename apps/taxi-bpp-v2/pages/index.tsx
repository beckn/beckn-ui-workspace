import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), {
    ssr: false
  })

  const [onlineStatus, setOnlineStatus] = useState<boolean>(false)

  const { t } = useLanguage()

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const geoLocationSearchPageSelectedLatLong = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.geoLatLong
  )
  const selectLatLong = geoLocationSearchPageSelectedLatLong.split(',')

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress,
    setEnableLocation
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    const status = localStorage.getItem('onlineStatus')
    setOnlineStatus(JSON.parse(status!))
  }, [])

  const handleOnEnableLocation = () => {
    setEnableLocation?.(true)
  }

  const renderMap = useCallback(() => {
    return (
      <MapWithNoSSR
        coordinates={
          selectLatLong.length === 2
            ? { latitude: Number(selectLatLong[0]), longitude: Number(selectLatLong[1]) }
            : coordinates
        }
      />
    )
  }, [coordinates, selectLatLong])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
        enableLocation={true}
        handleOnEnableLocation={handleOnEnableLocation}
        onlineOfflineSwitch={true}
        onlineStatus={onlineStatus}
        handleOnSwitch={() => {
          setOnlineStatus(!onlineStatus)
          localStorage.setItem('onlineStatus', JSON.stringify(!onlineStatus))
        }}
      />
      {renderMap()}
    </>
  )
}

export default Homepage
