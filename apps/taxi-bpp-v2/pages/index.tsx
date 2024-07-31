import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { BottomModal } from '@beckn-ui/molecules'
import RideSummaryHeader from '@components/ride-summary/rideSummaryHeader'
import RideSummary from '@components/ride-summary/rideSummary'

const Homepage = () => {
  const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false })

  const [onlineStatus, setOnlineStatus] = useState<boolean>(false)
  const { t } = useLanguage()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const [rideStatuses, setRideStatus] = useState([
    {
      id: 'pick-up',
      title: 'Going for Pick-up',
      subTitle: 'You have reached Pickup location',
      time: '5 min away',
      distance: '5 Kms',
      source: 'Raja Dinkar Kelkar Museum',
      destination: '',
      buttonText: 'Start Ride',
      buttonDisabled: false
    },
    {
      id: 'ride-started',
      title: 'Ride Started',
      subTitle: 'Heading to destination',
      time: 'Estimated time: 15 min',
      distance: '10 Kms',
      source: 'Raja Dinkar Kelkar Museum',
      destination: 'Destination',
      buttonText: 'ride-started',
      buttonDisabled: false
    },
    {
      id: 'completed',
      title: 'Ride Completed',
      subTitle: 'You have reached the destination',
      time: 'Completed',
      distance: '0 Kms',
      source: 'Raja Dinkar Kelkar Museum',
      destination: 'Destination',
      buttonText: 'Completed',
      buttonDisabled: false
    },
    {
      id: 'end',
      title: 'End of Ride',
      subTitle: 'The ride has ended',
      time: 'End',
      distance: '0 Kms',
      source: 'Raja Dinkar Kelkar Museum',
      destination: 'Destination',
      buttonText: 'End',
      buttonDisabled: true
    }
    // Additional ride statuses can be added here
  ])

  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
  const [currentModalId, setCurrentModalId] = useState<string | null>(null)

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
    if (status !== null) {
      setOnlineStatus(JSON.parse(status))
    }
  }, [])

  useEffect(() => {
    setCurrentModalId(rideStatuses[currentStatusIndex].id)
  }, [currentStatusIndex, rideStatuses])

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

  const handleClick = () => {
    setCurrentStatusIndex(prevIndex => Math.min(prevIndex + 1, rideStatuses.length - 1))
  }

  const currentStatus = rideStatuses[currentStatusIndex]
  console.log(currentStatus)
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
          const newStatus = !onlineStatus
          setOnlineStatus(newStatus)
          localStorage.setItem('onlineStatus', JSON.stringify(newStatus))
        }}
      />
      {renderMap()}
      <BottomModal
        onClose={() => {}}
        isOpen={true}
        title={
          <RideSummaryHeader
            driverImg="/images/car.svg"
            title={currentStatus.title}
            subTitle={currentStatus.subTitle}
          />
        }
      >
        <RideSummary
          time={currentStatus.time}
          distance={currentStatus.distance}
          source={currentStatus.source}
          destination={currentStatus.destination}
          buttons={[
            {
              text: currentStatus.buttonText,
              handleClick,
              disabled: currentStatus.buttonDisabled,
              variant: 'solid',
              colorScheme: 'primary'
            }
          ]}
        />
      </BottomModal>
    </>
  )
}

export default Homepage
