import React, { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import {
  Coordinate,
  feedbackActions,
  IGeoLocationSearchPageRootState,
  setGeoAddressAndLatLong,
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
import {
  useGetNewRideRequestMutation,
  useGetRideSummaryMutation,
  useToggleAvailabilityMutation,
  useUpdateDriverLocationMutation,
  useUpdateRideStatusMutation
} from '@services/RiderService'
import { goOffline, goOnline, RiderRootState, updateLocation } from '@store/rider-slice'
import { formatGeoLocationDetails } from '@utils/geoLocation-utils'
import { RideStatusRootState, setNewRideRequest, updateDriverStatus } from '@store/rideStatus-slice'
import { parsedNewRideDetails, RIDE_STATUS_CODE } from '@utils/ride-utils'
import { parseRideSummaryData, RideSummaryModalProp } from '@utils/rideSummary-utils'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  const [currentModal, setCurrentModal] = useState<ModalDetails>()
  const [destination, setDestination] = useState<Coordinate>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startNav, setStartNav] = useState<boolean>(false)
  const rideRequestList = useRef<RideDetailsModel[]>([])
  const currentRideReqIndex = useRef<number>(0)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [toggleAvailability] = useToggleAvailabilityMutation()
  const [getNewRideRequest] = useGetNewRideRequestMutation()
  const [updateRideStatus] = useUpdateRideStatusMutation()
  const [getRideSummary] = useGetRideSummaryMutation()
  const [updateDriverLocation] = useUpdateDriverLocationMutation()
  const { isOnline, currentLocation } = useSelector((state: RiderRootState) => state.rider)
  const { currentAcceptedRideRequest, driverStatus } = useSelector((state: RideStatusRootState) => state.rideStatus)
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
        dispatch(
          updateLocation({
            address: originGeoAddress,
            geoLocation: formatGeoLocationDetails(result.updateLocationResponse.gps)
          })
        )
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

  const getAllRideRequests = useCallback(async () => {
    if (isOnline) {
      const response: any = await getNewRideRequest({})
      const newRides: any[] = response?.data?.data?.validOrders
      console.log('called')
      if (newRides?.length > 0) {
        const result = await parsedNewRideDetails(response?.data?.data?.validOrders)
        console.log('new ride req list--> ', result)
        rideRequestList.current = result
        showNextRideRequest(result)
      }
    } else {
      rideRequestList.current = []
    }
  }, [isOnline])

  useEffect(() => {
    getAllRideRequests()
  }, [isOnline])

  const showNextRideRequest = (rideRequests: RideDetailsModel[]) => {
    if (rideRequests.length > 0) {
      updateCurrentModal('REQ_NEW_RIDE', rideRequests[0])
    } else {
      setCurrentModal(undefined)
    }
    rideRequestList.current = rideRequests
  }

  const handleNavigate = (data: Coordinate, startNav: boolean = true) => {
    console.log('source--> ', currentLocation)
    console.log('destination--> ', data)
    setDestination(data)
    setStartNav(startNav)
  }

  const handleAccept = async (data: RideDetailsModel) => {
    console.log('Accepted:', data)
    dispatch(setNewRideRequest(data))
    await updateRideStatus({
      order_id: data.orderId,
      order_status: RIDE_STATUS_CODE.RIDE_ACCEPTED
    })
    dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_ACCEPTED))
    handleModalSubmit('REQ_NEW_RIDE', data)
    rideRequestList.current = []
    currentRideReqIndex.current = 0
  }

  const handleDecline = async (data: RideDetailsModel) => {
    await updateRideStatus({
      order_id: data.orderId,
      order_status: RIDE_STATUS_CODE.RIDE_DECLINED
    })
    dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_DECLINED))
    console.log(rideRequestList.current)
    const results = rideRequestList.current.slice(1)
    console.log(results)
    showNextRideRequest(results)
  }

  const updateCurrentModal = (modalType: ModalTypes, data: RideDetailsModel) => {
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
            handleClick: () => handleAccept(data)
          },
          {
            ...defaultBtnState,
            text: 'Decline',
            variant: 'outline',
            color: '#D22323',
            handleClick: () => handleDecline(data)
          }
        ]
      }
    } else if (modalType === 'GOING_FOR_PICK_UP') {
      modalDetails = {
        id: 'GOING_FOR_PICK_UP',
        title: 'Going for Pick-up',
        subTitle: 'you have reached Pickup location',
        rideDetails: data,
        buttons: [
          {
            ...defaultBtnState,
            text: 'Reached Pick-up Location',
            className: 'taxi-bpp-btn-text',
            handleClick: async () => {
              await updateRideStatus({
                order_id: data.orderId,
                order_status: RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION
              })
              dispatch(updateDriverStatus(RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION))
              await updateDriverLocation({
                location: {
                  lat: data.sourceGeoLocation?.latitude.toString()!,
                  long: data.sourceGeoLocation?.longitude.toString()!
                }
              })
              dispatch(
                setGeoAddressAndLatLong({
                  geoAddress: data.source,
                  geoLatLong: `${data.sourceGeoLocation?.latitude}, ${data.sourceGeoLocation?.longitude}`
                })
              )
              handleModalSubmit('GOING_FOR_PICK_UP', data)
            }
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
            handleClick: async () => {
              await updateRideStatus({
                order_id: data.orderId,
                order_status: RIDE_STATUS_CODE.RIDE_STARTED
              })
              dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_STARTED))
              handleNavigate?.(data.destinationGeoLocation!)
              handleModalSubmit('REACHED_PICK_UP', data)
            }
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
            handleClick: async () => {
              await updateRideStatus({
                order_id: data.orderId,
                order_status: RIDE_STATUS_CODE.RIDE_COMPLETED
              })
              dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_COMPLETED))
              const endRideData = await getRideSummary({
                order_id: data.orderId
              })
              const parsedData = parseRideSummaryData(endRideData)

              await updateDriverLocation({
                location: {
                  lat: data.destinationGeoLocation?.latitude.toString()!,
                  long: data.destinationGeoLocation?.longitude.toString()!
                }
              })
              dispatch(
                setGeoAddressAndLatLong({
                  geoAddress: data.destination,
                  geoLatLong: `${data.destinationGeoLocation?.latitude}, ${data.destinationGeoLocation?.longitude}`
                })
              )
              handleModalSubmit('START_RIDE', parsedData)
            }
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
            handleClick: () => handleModalSubmit('COMPLETED', data)
          }
        ],
        fare: {
          text: 'Collect the fare from the customer',
          cost: data?.cost
        }
      }
    }

    setCurrentModal(modalDetails as ModalDetails)
  }

  const handleModalSubmit = useCallback(
    (currentModalType: ModalTypes, data: RideDetailsModel) => {
      switch (currentModalType) {
        case 'REQ_NEW_RIDE':
          console.log('Accepted')
          updateCurrentModal('GOING_FOR_PICK_UP', {
            ...data,
            handleNavigate: handleNavigate
          })
          break
        case 'GOING_FOR_PICK_UP':
          console.log('pick up')
          setDestination(undefined)
          updateCurrentModal('REACHED_PICK_UP', {
            ...data,
            handleNavigate: handleNavigate
          })
          break
        case 'REACHED_PICK_UP':
          console.log('reached pick up')
          updateCurrentModal('START_RIDE', {
            ...data,
            handleNavigate: handleNavigate
          })
          break
        case 'START_RIDE':
          console.log('Start ride')
          setDestination(undefined)
          updateCurrentModal('COMPLETED', {
            ...data
          })
          break
        case 'COMPLETED':
          console.log('completed')
          setCurrentModal(undefined)
          break

        default:
          break
      }
    },
    [currentAcceptedRideRequest]
  )

  const { geoAddress: originGeoAddress, geoLatLong: originGeoLatLong } = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI
  )

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      const locationDetails = {
        address: originGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(updateLocation(locationDetails))
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      const locationDetails = {
        address: currentAddress,
        geoLocation: coordinates
      }

      dispatch(updateLocation(locationDetails))
    }
  }, [currentAddress, coordinates, originGeoAddress, originGeoLatLong])

  const renderMap = useCallback(() => {
    return (
      <Box mt={'60px'}>
        <MapWithNoSSR
          startNav={startNav}
          origin={currentLocation.geoLocation}
          destination={destination}
        />
      </Box>
    )
  }, [currentLocation, destination, startNav])

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
                driverStatus={driverStatus}
                orderId={currentModal.rideDetails.orderId}
                time={currentModal.rideDetails?.time!}
                date={currentModal.rideDetails?.date}
                distance={currentModal.rideDetails?.distance!}
                source={currentModal.rideDetails.source}
                sourceGps={currentModal.rideDetails.sourceGeoLocation}
                destination={currentModal.rideDetails?.destination}
                destinationGps={currentModal.rideDetails.destinationGeoLocation}
                buttons={currentModal.buttons}
                fare={currentModal?.fare}
                handleNavigate={currentModal.rideDetails?.handleNavigate}
              />
            </BottomModal>
          )}
      </>
    )
  }, [currentModal, isOnline, driverStatus])

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
          handleAvailability(newStatus, currentLocation?.geoLocation!)
        }}
      />

      {currentLocation?.geoLocation?.latitude && currentLocation?.geoLocation?.longitude && (
        <>
          {renderMap()}
          {renderModals()}
        </>
      )}
    </>
  )
}

export default Homepage
