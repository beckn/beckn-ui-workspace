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
            text: 'Accept',
            className: 'taxi-bpp-btn-text'
          },
          {
            ...defaultBtnState,
            text: 'Decline',
            variant: 'outline',
            color: '#D22323'
          }
        ]
      }
    } else if (modalType === 'PICK_UP') {
      modalDetails = {
        id: 'PICK_UP',
        title: 'Going for Pick-up',
        subTitle: 'You have reached Pickup location',
        rideDetails: {
          time: '5 min away',
          distance: '5 Kms',
          handleNavigate: () => {},
          source: 'Raja Dinkar Kelkar Museum',
          destination: ''
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Reached Pick-up Location',
            className: 'taxi-bpp-btn-text'
          }
        ]
      }
    } else if (modalType === 'RIDE_STARTED') {
      modalDetails = {
        id: 'RIDE_STARTED',
        title: 'Reached Pick-up Location',
        subTitle: 'you have reached Pickup location',
        rideDetails: {
          time: 'Estimated time: 15 min',
          distance: '10 Kms',
          handleNavigate: () => {},
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Start Ride',
            className: 'taxi-bpp-btn-text'
          }
        ]
      }
    } else if (modalType === 'COMPLETED') {
      modalDetails = {
        id: 'COMPLETED',
        title: 'Ride has Started',
        subTitle: 'You have reached the destination',
        rideDetails: {
          time: 'Completed',
          distance: '0 Kms',
          handleNavigate: () => {},
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'End Ride',
            colorScheme: 'secondary'
          }
        ]
      }
    } else if (modalType === 'END') {
      modalDetails = {
        id: 'END',
        title: 'Ride has Completed',
        subTitle: 'The ride has ended',
        rideDetails: {
          time: '30 min',
          date: 'Wednesday, 26/05/2024',
          distance: '0 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        },
        buttons: [
          {
            ...defaultBtnState,
            text: 'Look for New Ride Request',
            className: 'taxi-bpp-btn-text'
          }
        ],
        fare: {
          text: 'Collect the fare from the customer',
          cost: '200'
        }
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
            divider="DASHED"
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
              date={currentModal.rideDetails.date}
              handleNavigate={currentModal.rideDetails.handleNavigate}
              distance={currentModal.rideDetails.distance}
              source={currentModal.rideDetails.source}
              destination={currentModal.rideDetails.destination}
              buttons={currentModal.buttons}
              fare={currentModal.fare}
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
            updateCurrentModal('END')
          }
        }}
      />
      {renderMap()}
      {renderModals()}
    </>
  )
}

export default Homepage
