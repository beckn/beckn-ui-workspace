import React, { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import {
  Coordinate,
  feedbackActions,
  IGeoLocationSearchPageRootState,
  PickUpDropOffModel,
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
  useUpdateRideStatusMutation,
  useGetRideStatusMutation
} from '@services/RiderService'
import { goOffline, goOnline, RiderRootState, setCurrentRideRequest, updateLocation } from '@store/rider-slice'
import { formatGeoLocationDetails } from '@utils/geoLocation-utils'
import { RideStatusRootState, setNewRideRequest, updateDriverStatus } from '@store/rideStatus-slice'
import { parsedNewRideDetails, RIDE_STATUS_CODE } from '@utils/ride-utils'
import { parseRideSummaryData } from '@utils/rideSummary-utils'
import _ from 'lodash'
import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import useSocket from '@hooks/useSocket'
import { AuthRootState } from '@store/auth-slice'
import { testIds } from '@shared/dataTestIds'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  // const [current_Modal, setCurrentM_odal] = useState<ModalDetails>()
  const [destination, setDestination] = useState<Coordinate>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startNav, setStartNav] = useState<boolean>(false)
  const rideRequestList = useRef<RideDetailsModel[]>([])

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [toggleAvailability] = useToggleAvailabilityMutation()
  const [updateRideStatus] = useUpdateRideStatusMutation()
  const [getRideSummary] = useGetRideSummaryMutation()
  const [updateDriverLocation] = useUpdateDriverLocationMutation()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { isOnline, currentLocation, currentRideRequest } = useSelector((state: RiderRootState) => state.rider)
  const { currentAcceptedRideRequest, driverStatus } = useSelector((state: RideStatusRootState) => state.rideStatus)
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  console.log(currentRideRequest)
  const socket = useSocket(strapiUrl!, {
    query: {
      agentId: user?.agent?.id
    },
    reconnection: true
    // transports: ['websocket']
  })

  const handleAvailability = useCallback(async (availability: boolean, geoLatLong: Coordinate) => {
    try {
      const requestBody = {
        available: availability,
        location: { lat: geoLatLong?.latitude.toString(), long: geoLatLong?.longitude.toString() }
      }

      const result: any = await toggleAvailability(requestBody).unwrap()
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

  const newRideRequests = useCallback(
    async (response: any) => {
      if (
        isOnline &&
        [RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL, RIDE_STATUS_CODE.RIDE_DECLINED].includes(driverStatus)
      ) {
        const newRides: any[] = response?.validOrders
        const result = await parsedNewRideDetails(newRides)
        rideRequestList.current = result
        showNextRideRequest(rideRequestList.current)
      } else {
        rideRequestList.current = []
      }
    },
    [isOnline, driverStatus]
  )

  const showNextRideRequest = (rideRequests: RideDetailsModel[]) => {
    if (rideRequests.length > 0) {
      updateCurrentModal('REQ_NEW_RIDE', rideRequests[0])
    } else {
      dispatch(setCurrentRideRequest(undefined))
    }
    rideRequestList.current = rideRequests
  }

  const handleNavigate = (data: Coordinate, startNav: boolean = true) => {
    setDestination(data)
    setStartNav(startNav)
  }

  const handleAccept = async (data: RideDetailsModel) => {
    try {
      console.log('Accepted:', data)
      dispatch(setNewRideRequest(data))
      await updateRideStatus({
        order_id: data.orderId,
        order_status: RIDE_STATUS_CODE.RIDE_ACCEPTED
      }).unwrap()
      dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_ACCEPTED))
      handleModalSubmit('REQ_NEW_RIDE', data)
      rideRequestList.current = []
    } catch (err) {
      console.error('Error while accepting ride--> ', err)
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
  }

  const handleDecline = async (data: RideDetailsModel) => {
    try {
      await updateRideStatus({
        order_id: data.orderId,
        order_status: RIDE_STATUS_CODE.RIDE_DECLINED
      }).unwrap()
      dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_DECLINED))
      const results = rideRequestList.current.slice(1)
      showNextRideRequest(results)
    } catch (err) {
      console.error('Error while accepting ride--> ', err)
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
  }

  const handleReachedPickupLocation = async (data: RideDetailsModel) => {
    try {
      await updateRideStatus({
        order_id: data.orderId,
        order_status: RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION
      }).unwrap()
      dispatch(updateDriverStatus(RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION))
      await updateDriverLocation({
        location: {
          lat: data.sourceGeoLocation?.latitude.toString()!,
          long: data.sourceGeoLocation?.longitude.toString()!
        }
      }).unwrap()
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: data.source,
          country: localStorage.getItem('country')!,
          geoLatLong: `${data.sourceGeoLocation?.latitude}, ${data.sourceGeoLocation?.longitude}`
        })
      )
      handleModalSubmit('GOING_FOR_PICK_UP', data)
    } catch (err) {
      console.error('Error while accepting ride--> ', err)
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
  }

  const handleStartRide = async (data: RideDetailsModel) => {
    try {
      await updateRideStatus({
        order_id: data.orderId,
        order_status: RIDE_STATUS_CODE.RIDE_STARTED
      }).unwrap()
      dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_STARTED))
      handleNavigate?.(data.destinationGeoLocation!)
      handleModalSubmit('REACHED_PICK_UP', data)
    } catch (err) {
      console.error('Error while accepting ride--> ', err)
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
  }

  const handleEndRide = async (data: RideDetailsModel) => {
    try {
      await updateRideStatus({
        order_id: data.orderId,
        order_status: RIDE_STATUS_CODE.RIDE_COMPLETED
      }).unwrap()
      dispatch(updateDriverStatus(RIDE_STATUS_CODE.RIDE_COMPLETED))
      const endRideData = await getRideSummary({
        order_id: data.orderId
      }).unwrap()

      const parsedData = parseRideSummaryData(endRideData, data)
      if (!parsedData.source) parsedData.source = data.source
      if (!parsedData.destination) parsedData.destination = data.destination

      await updateDriverLocation({
        location: {
          lat: data.destinationGeoLocation?.latitude.toString()!,
          long: data.destinationGeoLocation?.longitude.toString()!
        }
      }).unwrap()
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: data.destination,
          country: localStorage.getItem('country')!,
          geoLatLong: `${data.destinationGeoLocation?.latitude}, ${data.destinationGeoLocation?.longitude}`
        })
      )
      handleModalSubmit('START_RIDE', parsedData)
    } catch (err) {
      console.error('Error while accepting ride--> ', err)
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
  }

  const handleLookForNewRide = (data: RideDetailsModel) => {
    handleModalSubmit('COMPLETED', data)
    dispatch(updateDriverStatus(RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL))
  }
  // console.log(RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL)
  localStorage.setItem('actionType', RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL)
  const getModalButtons = (
    actionType: ModalTypes,
    data: RideDetailsModel
  ): { submitBtns: ButtonProps[]; navigateBtn?: (data: Coordinate, startNav?: boolean) => void } => {
    const defaultBtnState: ButtonProps = {
      disabled: false,
      variant: 'solid',
      colorScheme: 'primary'
    }
    switch (actionType) {
      case 'REQ_NEW_RIDE':
        return {
          submitBtns: [
            {
              ...defaultBtnState,
              text: 'Accept',
              className: 'taxi-bpp-btn-text',
              handleClick: () => handleAccept(data),
              dataTest: testIds.taxi_BPP_accept_button
            },
            {
              ...defaultBtnState,
              text: 'Decline',
              variant: 'outline',
              color: '#D22323',
              handleClick: () => handleDecline(data),
              dataTest: testIds.taxi_BPP_decline_button
            }
          ]
        }
      case 'GOING_FOR_PICK_UP':
        return {
          navigateBtn: handleNavigate,
          submitBtns: [
            {
              ...defaultBtnState,
              text: 'Reached Pick-up Location',
              className: 'taxi-bpp-btn-text',
              handleClick: () => handleReachedPickupLocation(data),
              dataTest: testIds.taxi_BPP_Reached_Pick_up_Location_button
            }
          ]
        }
      case 'REACHED_PICK_UP':
        return {
          navigateBtn: handleNavigate,
          submitBtns: [
            {
              ...defaultBtnState,
              text: 'Start Ride',
              className: 'taxi-bpp-btn-text',
              handleClick: () => handleStartRide(data),
              dataTest: testIds.taxi_BPP_Start_ride_button
            }
          ]
        }
      case 'START_RIDE':
        return {
          navigateBtn: handleNavigate,
          submitBtns: [
            {
              ...defaultBtnState,
              text: 'End Ride',
              colorScheme: 'secondary',
              handleClick: () => handleEndRide(data),
              dataTest: testIds.taxi_BPP_end_ride_button
            }
          ]
        }
      case 'COMPLETED':
        return {
          submitBtns: [
            {
              ...defaultBtnState,
              text: 'Look for New Ride Request',
              className: 'taxi-bpp-btn-text',
              handleClick: () => handleLookForNewRide(data),
              dataTest: testIds.taxi_BPP_Look_for_New_Ride_Request_button
            }
          ]
        }
      default:
        return { navigateBtn: () => {}, submitBtns: [] }
    }
  }

  const updateCurrentModal = (modalType: ModalTypes, data: RideDetailsModel) => {
    // below code is to render the ride related modals
    let modalDetails

    if (modalType === 'REQ_NEW_RIDE') {
      modalDetails = {
        id: 'REQ_NEW_RIDE',
        title: 'New Ride Request',
        subTitle: '',
        rideDetails: data
      }
    } else if (modalType === 'GOING_FOR_PICK_UP') {
      modalDetails = {
        id: 'GOING_FOR_PICK_UP',
        title: 'Going for Pick-up',
        subTitle: 'you have reached Pickup location',
        dataTest: 'GOING_FOR_PICK_UP',
        rideDetails: data
      }
    } else if (modalType === 'REACHED_PICK_UP') {
      modalDetails = {
        id: 'REACHED_PICK_UP',
        title: 'Reached Pick-up Location',
        dataTest: 'REACHED_PICK_UP',
        subTitle: 'you have reached Pickup location',
        rideDetails: data
      }
    } else if (modalType === 'START_RIDE') {
      modalDetails = {
        id: 'START_RIDE',
        dataTest: 'START_RIDE',
        title: 'Ride has Started',
        subTitle: 'you are on the way to drop location',
        rideDetails: data
      }
    } else if (modalType === 'COMPLETED') {
      modalDetails = {
        id: 'COMPLETED',
        title: 'Ride has Completed',
        dataTest: 'COMPLETED',
        subTitle: 'you have arrived at Dropoff location',
        rideDetails: data,
        fare: {
          text: 'Collect the fare from the customer',
          cost: data?.cost
        }
      }
    }

    dispatch(setCurrentRideRequest(modalDetails as ModalDetails))
  }

  const handleModalSubmit = useCallback(
    (currentModalType: ModalTypes, data: RideDetailsModel) => {
      switch (currentModalType) {
        case 'REQ_NEW_RIDE':
          console.log('Accepted')
          updateCurrentModal('GOING_FOR_PICK_UP', data)
          break
        case 'GOING_FOR_PICK_UP':
          console.log('pick up')
          setDestination(undefined)
          updateCurrentModal('REACHED_PICK_UP', data)
          break
        case 'REACHED_PICK_UP':
          console.log('reached pick up')
          updateCurrentModal('START_RIDE', data)
          break
        case 'START_RIDE':
          console.log('Start ride')
          setDestination(undefined)
          updateCurrentModal('COMPLETED', data)
          break
        case 'COMPLETED':
          console.log('completed')
          dispatch(setCurrentRideRequest(undefined))
          break

        default:
          break
      }
    },
    [currentAcceptedRideRequest]
  )

  const {
    geoAddress: originGeoAddress,
    geoLatLong: originGeoLatLong,
    country: originCountry
  } = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI)

  const {
    currentAddress,
    coordinates,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress,
    country
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    let locationDetails: PickUpDropOffModel | null = null
    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      locationDetails = {
        address: originGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }
      console.log('originCountry', originCountry)
      localStorage.setItem('country', originCountry)
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      locationDetails = {
        address: currentAddress,
        geoLocation: coordinates
      }
      console.log('country', country)
      localStorage.setItem('country', country)
    }
    if (locationDetails) {
      dispatch(updateLocation(locationDetails))
      updateDriverLocation({
        location: {
          lat: locationDetails.geoLocation.latitude.toString()!,
          long: locationDetails.geoLocation.longitude.toString()!
        }
      })
    }
  }, [currentAddress, coordinates, originGeoAddress, originGeoLatLong, country, originCountry])

  const updatedRideStatus = async (response: any) => {
    const orderId = currentRideRequest?.rideDetails.orderId
    if (
      orderId === response.order_id.id &&
      [
        RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL,
        RIDE_STATUS_CODE.RIDE_ACCEPTED,
        RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION
      ].includes(driverStatus)
    ) {
      const acceptedByAgentId = response.fulfilment_id.service.agent_id.id
      const canceledStatusCode = response.state_code
      const currentStatus = response.state_value
      if (user?.agent?.id !== acceptedByAgentId && currentStatus === RIDE_STATUS_CODE.RIDE_ACCEPTED) {
        rideRequestList.current = []
        dispatch(setCurrentRideRequest(undefined))
      }
      if (canceledStatusCode === 'USER CANCELLED') {
        dispatch(setCurrentRideRequest(undefined))
        dispatch(updateDriverStatus(RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL))
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Ride Cancelled',
              display: true,
              type: 'warning',
              description: 'The user has cancelled the ride. You may wait for a new request.'
            }
          })
        )
      }
    }
  }
  useEffect(() => {
    if (socket) {
      const handleShowRides = (data: any) => {
        newRideRequests(data)
      }

      const handleRideStatus = (data: any) => {
        updatedRideStatus(data)
      }

      socket.on('show-rides', handleShowRides)
      socket.on('ride-status', handleRideStatus)

      return () => {
        socket.off('show-rides', handleShowRides)
        socket.off('ride-status', handleRideStatus)
      }
    }
  }, [socket, newRideRequests, updatedRideStatus])

  const returnToCurrentLocation = useCallback(async (coords: any) => {
    await updateDriverLocation({
      location: {
        lat: coords.latitude.toString()!,
        long: coords.longitude.toString()!
      }
    }).unwrap()
    dispatch(
      setGeoAddressAndLatLong({
        geoAddress: coords.address,
        country: localStorage.getItem('country')!,
        geoLatLong: `${coords.latitude}, ${coords.longitude}`
      })
    )
  }, [])

  const renderMap = useCallback(() => {
    return (
      <Box mt={'60px'}>
        <MapWithNoSSR
          startNav={startNav}
          enableMyLocation={driverStatus === RIDE_STATUS_CODE.AWAITING_DRIVER_APPROVAL}
          origin={currentLocation.geoLocation}
          destination={destination}
          setCurrentOrigin={returnToCurrentLocation}
        />
      </Box>
    )
  }, [currentLocation, destination, startNav])

  const renderModals = useCallback(() => {
    return (
      <>
        <OfflineModal isOpen={!isOnline} />
        {isOnline &&
          currentRideRequest &&
          Object.keys(currentRideRequest).length > 0 &&
          currentRideRequest.rideDetails &&
          Object.keys(currentRideRequest.rideDetails).length > 0 && (
            <BottomDrawer
              title={
                currentRideRequest.id === 'REQ_NEW_RIDE' ? (
                  currentRideRequest.title
                ) : (
                  <RideSummaryHeader
                    driverImg="/images/blankImg.svg"
                    title={currentRideRequest.title}
                    subTitle={currentRideRequest.subTitle}
                    customerContact={currentRideRequest.rideDetails?.customerDetails?.contact!}
                    dataTest={currentRideRequest.dataTest}
                  />
                )
              }
            >
              <RideSummary
                driverStatus={driverStatus}
                orderId={currentRideRequest.rideDetails.orderId}
                time={currentRideRequest.rideDetails?.time!}
                date={currentRideRequest.rideDetails?.date}
                distance={currentRideRequest.rideDetails?.distance!}
                source={currentRideRequest.rideDetails.source}
                sourceGps={currentRideRequest.rideDetails.sourceGeoLocation}
                destination={currentRideRequest.rideDetails?.destination}
                destinationGps={currentRideRequest.rideDetails.destinationGeoLocation}
                buttons={getModalButtons(currentRideRequest.id, currentRideRequest.rideDetails).submitBtns}
                fare={currentRideRequest?.fare}
                customerDetails={currentRideRequest.rideDetails?.customerDetails!}
                handleNavigate={getModalButtons(currentRideRequest.id, currentRideRequest.rideDetails)?.navigateBtn}
              />
            </BottomDrawer>
          )}
      </>
    )
  }, [currentRideRequest, isOnline, driverStatus])

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
