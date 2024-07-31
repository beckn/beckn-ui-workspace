import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { BottomModal, ButtonProps } from '@beckn-ui/molecules'
import RideSummaryHeader from '@components/ride-summary/rideSummaryHeader'
import RideSummary from '@components/ride-summary/rideSummary'
import OfflineModal from '@components/BottomModal'
import { ModalDetails, ModalTypes, RideDetailsModel } from '@lib/types/mapScreen'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  const [onlineStatus, setOnlineStatus] = useState<boolean>(false)
  const [currentModal, setCurrentModal] = useState<ModalDetails>()

  const { t } = useLanguage()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const handleModalSubmit = () => {}

  const updateCurrentModal = (modalType: ModalTypes, data?: RideDetailsModel) => {
    let modalDetails

    const defaultBtnState: ButtonProps = {
      handleClick: handleModalSubmit,
      disabled: false,
      variant: 'solid',
      colorScheme: 'primary'
    }

    if (modalType === 'REQ_NEW_RIDE') {
      modalDetails = {
        id: 'REQ_NEW_RIDE',
        title: 'New Ride Request',
        subTitle: '',
        rideDetails: {
          time: '5 min away',
          distance: '5 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Accept'
          },
          {
            ...defaultBtnState,
            text: 'Decline',
            variant: 'outline',
            color: 'red'
          }
        ]
      }
    } else if (modalType === 'PICK_UP') {
      modalDetails = {
        id: 'PICK_UP',
        title: 'Going for Pick-up',
        subTitle: 'You have reached Pickup location',
        rideDetails: { time: '5 min away', distance: '5 Kms', source: 'Raja Dinkar Kelkar Museum', destination: '' },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Start Ride'
          }
        ]
      }
    } else if (modalType === 'RIDE_STARTED') {
      modalDetails = {
        id: 'RIDE_STARTED',
        title: 'Ride Started',
        subTitle: 'Heading to destination',
        rideDetails: {
          time: 'Estimated time: 15 min',
          distance: '10 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'ride-started',
            colorScheme: 'red'
          }
        ]
      }
    } else if (modalType === 'COMPLETED') {
      modalDetails = {
        id: 'COMPLETED',
        title: 'Ride Completed',
        subTitle: 'You have reached the destination',
        rideDetails: {
          time: 'Completed',
          distance: '0 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Completed'
          }
        ]
      }
    } else if (modalType === 'END') {
      modalDetails = {
        id: 'END',
        title: 'End of Ride',
        subTitle: 'The ride has ended',
        rideDetails: {
          time: 'End',
          distance: '0 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'End'
          }
        ]
      }
    }

    setCurrentModal(modalDetails as ModalDetails)
  }

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

  const renderModals = useCallback(() => {
    return (
      <>
        <OfflineModal isOpen={!onlineStatus} />
        {onlineStatus && currentModal && Object.keys(currentModal).length > 0 && (
          <BottomModal
            onClose={() => {}}
            isOpen={true}
            title={
              currentModal.id === 'REQ_NEW_RIDE' ? (
                currentModal.title
              ) : (
                <RideSummaryHeader
                  driverImg="/images/car.svg"
                  title={currentModal.title}
                  subTitle={currentModal.subTitle}
                />
              )
            }
          >
            <RideSummary
              time={currentModal.rideDetails.time}
              distance={currentModal.rideDetails.distance}
              source={currentModal.rideDetails.source}
              destination={currentModal.rideDetails.destination}
              buttons={currentModal.buttons}
            />
          </BottomModal>
        )}
      </>
    )
  }, [currentModal, onlineStatus])

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
          if (onlineStatus) {
            updateCurrentModal('COMPLETED')
          }
        }}
      />
      {renderMap()}
      {renderModals()}
    </>
  )
}

export default Homepage
