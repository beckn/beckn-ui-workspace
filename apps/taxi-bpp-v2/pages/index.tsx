import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import {
  Coordinate,
  feedbackActions,
  IGeoLocationSearchPageRootState,
  TopSheet,
  useGeolocation
} from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { BottomModal, ButtonProps } from '@beckn-ui/molecules'
import RideSummaryHeader from '@components/ride-summary/rideSummaryHeader'
import RideSummary from '@components/ride-summary/rideSummary'
import OfflineModal from '@components/BottomModal'
import { ModalDetails, ModalTypes, RideDetailsModel } from '@lib/types/mapScreen'
import { Box } from '@chakra-ui/react'
import { useToggleAvailabilityMutation } from '@services/RiderService'
import { goOffline, goOnline, RiderRootState, updateLocation } from '@store/rider-slice'
import { formatGeoLocationDetails } from '@utils/geoLocation-utils'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  const [currentModal, setCurrentModal] = useState<ModalDetails>()
  const [destination, setDestination] = useState<Coordinate>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [toggleAvailability] = useToggleAvailabilityMutation()
  const { isOnline, currentLocation } = useSelector((state: RiderRootState) => state.rider)
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const handleAvailability = useCallback(async (availability: boolean, geoLatLong: Coordinate) => {
    try {
      const requestBody = {
        available: availability,
        location: { lat: geoLatLong?.latitude.toString(), long: geoLatLong?.longitude.toString() }
      }

      const response: any = await toggleAvailability(requestBody)

      const result = response.data
      if (result && availability) {
        dispatch(goOnline(result.toggleAvailabiltiyResponse.is_available))
        dispatch(updateLocation(formatGeoLocationDetails(result.updateLocationResponse.gps)))
      } else {
        dispatch(goOffline(result.is_available))
      }
    } catch (error) {
      console.error('error while toggle-availability--> ', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Error',
            display: true,
            type: 'error',
            description: 'Something went wrong, please try again'
          }
        })
      )
    }
  }, [])

  useEffect(() => {
    // polling for new ride API call
    // when positive response received
    updateCurrentModal('REQ_NEW_RIDE', {
      time: '5 min away',
      distance: '5 Kms',
      source: 'Raja Dinkar Kelkar Museum',
      destination: 'Destination'
    })
  }, [])

  const handleDeclineNewReqRide = () => {
    setCurrentModal(undefined)
  }

  const handleNavigate = (data: Coordinate) => {
    console.log('source--> ', currentLocation)
    console.log('destination--> ', data)
    setDestination(data)
  }

  const handleModalSubmit = (type: ModalTypes) => {
    switch (type) {
      case 'REQ_NEW_RIDE':
        console.log('Accepted')
        updateCurrentModal('PICK_UP', {
          time: '5 min away',
          distance: '5 Kms',
          handleNavigate: handleNavigate,
          source: 'Raja Dinkar Kelkar Museum',
          destination: ''
        })
        break
      case 'PICK_UP':
        console.log('pick up')
        setDestination(undefined)
        updateCurrentModal('REACHED_PICK_UP', {
          time: 'Estimated time: 15 min',
          distance: '10 Kms',
          handleNavigate: handleNavigate,
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        })
        break
      case 'REACHED_PICK_UP':
        console.log('reached pick up')
        updateCurrentModal('START_RIDE', {
          time: '30 mins',
          distance: '0 Kms',
          handleNavigate: handleNavigate,
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        })
        break
      case 'START_RIDE':
        console.log('Start ride')
        setDestination(undefined)
        updateCurrentModal('COMPLETED', {
          time: '30 mins',
          date: 'Wednesday, 26/05/2024',
          distance: '0 Kms',
          source: 'Raja Dinkar Kelkar Museum',
          destination: 'Destination'
        })
        break
      case 'COMPLETED':
        console.log('completed')
        setCurrentModal(undefined)
        break

      default:
        break
    }
  }

  const updateCurrentModal = (modalType: ModalTypes, data?: RideDetailsModel) => {
    // below code is to render the ride related modals
    let modalDetails

    const defaultBtnState: ButtonProps = {
      disabled: false,
      variant: 'solid',
      colorScheme: 'primary'
    }

    if (modalType === 'REQ_NEW_RIDE') {
      modalDetails = {
        id: 'REQ_NEW_RIDE',
        title: 'New Ride Request',
        subTitle: '',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'Accept',
            className: 'taxi-bpp-btn-text',
            handleClick: () => handleModalSubmit('REQ_NEW_RIDE')
          },
          {
            ...defaultBtnState,
            text: 'Decline',
            variant: 'outline',
            color: '#D22323',
            handleClick: handleDeclineNewReqRide
          }
        ]
      }
    } else if (modalType === 'PICK_UP') {
      modalDetails = {
        id: 'PICK_UP',
        title: 'Going for Pick-up',
        subTitle: 'you have reached Pickup location',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'Reached Pick-up Location',
            className: 'taxi-bpp-btn-text',
            handleClick: () => handleModalSubmit('PICK_UP')
          }
        ]
      }
    } else if (modalType === 'REACHED_PICK_UP') {
      modalDetails = {
        id: 'REACHED_PICK_UP',
        title: 'Reached Pick-up Location',
        subTitle: 'you have reached Pickup location',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'Start Ride',
            className: 'taxi-bpp-btn-text',
            handleClick: () => handleModalSubmit('REACHED_PICK_UP')
          }
        ]
      }
    } else if (modalType === 'START_RIDE') {
      modalDetails = {
        id: 'START_RIDE',
        title: 'Ride has Started',
        subTitle: 'you are on the way to drop location',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'End Ride',
            colorScheme: 'secondary',
            handleClick: () => handleModalSubmit('START_RIDE')
          }
        ]
      }
    } else if (modalType === 'COMPLETED') {
      modalDetails = {
        id: 'COMPLETED',
        title: 'Ride has Completed',
        subTitle: 'you have arrived at Dropoff location',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'Look for New Ride Request',
            className: 'taxi-bpp-btn-text',
            handleClick: () => handleModalSubmit('COMPLETED')
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

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    const selectLatLong = geoLocationSearchPageSelectedLatLong.split(',')
    let currentCoords: Coordinate | undefined =
      selectLatLong.length === 2
        ? { latitude: Number(selectLatLong[0]), longitude: Number(selectLatLong[1]) }
        : coordinates!

    if (currentLocation?.latitude && currentLocation?.longitude) {
      currentCoords = currentLocation
    }

    dispatch(updateLocation(currentCoords!))
  }, [coordinates, geoLocationSearchPageSelectedLatLong])

  const renderMap = useCallback(() => {
    return (
      <Box mt={'60px'}>
        <MapWithNoSSR
          origin={currentLocation}
          destination={destination}
        />
      </Box>
    )
  }, [currentLocation, destination])

  const renderModals = useCallback(() => {
    return (
      <>
        <OfflineModal isOpen={!isOnline} />
        {isOnline &&
          currentModal &&
          Object.keys(currentModal).length > 0 &&
          currentModal.rideDetails &&
          Object.keys(currentModal.rideDetails).length > 0 && (
            <BottomModal
              backgroundAccessControl={true}
              onClose={() => {}}
              isOpen={true}
              divider="DASHED"
              title={
                currentModal.id === 'REQ_NEW_RIDE' ? (
                  currentModal.title
                ) : (
                  <RideSummaryHeader
                    driverImg="/images/blankImg.svg"
                    title={currentModal.title}
                    subTitle={currentModal.subTitle}
                  />
                )
              }
            >
              <RideSummary
                time={currentModal.rideDetails?.time!}
                date={currentModal.rideDetails?.date}
                distance={currentModal.rideDetails?.distance!}
                source={currentModal.rideDetails.source}
                destination={currentModal.rideDetails?.destination}
                buttons={currentModal.buttons}
                fare={currentModal?.fare}
                handleNavigate={currentModal.rideDetails?.handleNavigate}
              />
            </BottomModal>
          )}
      </>
    )
  }, [currentModal, isOnline])

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
        onlineOfflineSwitch={true}
        onlineStatus={isOnline ?? false}
        handleOnSwitch={() => {
          const newStatus = !isOnline
          handleAvailability(newStatus, currentLocation!)
        }}
      />

      {currentLocation?.latitude && currentLocation?.longitude && (
        <>
          {renderMap()}
          {renderModals()}
        </>
      )}
    </>
  )
}

export default Homepage
