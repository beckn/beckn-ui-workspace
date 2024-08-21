import { feedbackActions, GeoLocationType, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import DropOffChangeAlertModal from '@components/dropOffChangeAlertModal/dropOffChangeAlertModal'
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import RideDetails from './RideDetails'
import { useSelector } from 'react-redux'
import { UserGeoLocationRootState } from '@lib/types/user'
import { RideDetailsProps } from '@lib/types/cabService'
import { SelectRideRootState } from '@store/selectRide-slice'
import { Box } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import axios from '@services/axios'
import { v4 as uuidv4 } from 'uuid'
import { formatGeoLocationDetails } from '@utils/geoLocation-utils'
import { setDriverCurrentLocation } from '@store/cabService-slice'
import { RIDE_STATUS_CODE } from '@utils/general'
import { useRouter } from 'next/router'
import { setDropOffLocation, setPickUpLocation } from '@store/user-slice'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface RideDetailsContainerProps {
  handleCancelRide: () => void
  handleContactSupport: () => void
}

const RideDetailsContainer: React.FC<RideDetailsContainerProps> = ({ handleCancelRide, handleContactSupport }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rideStartedAlert, setRideStartedAlert] = useState<boolean>(false)

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)
  const [rideDetails, setRideDetails] = useState<RideDetailsProps | null>(null)
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)

  const dispatch = useDispatch()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (confirmResponse.length) {
      setIsLoading(true)
      const { message } = confirmResponse[0] || {}
      const { agent, vehicle, rating } = message?.fulfillments?.find(fulfillment => fulfillment.agent)!
      setRideDetails({
        name: agent?.person.name!,
        registrationNumber: vehicle?.registration!,
        carModel: `${vehicle?.make!} ${vehicle?.model!}`,
        rating: rating!,
        contact: agent?.contact.phone!,
        price: message.quote?.price?.value
      })
      setIsLoading(false)
    }
  }, [confirmResponse])

  const handleAlertSubmit = (addressType: GeoLocationType) => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }

  const getRideStatus = () => {
    const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
    if (selectedOrderData) {
      const { bppId, bppUri, orderId } = selectedOrderData
      const payload = {
        data: [
          {
            context: {
              transaction_id: uuidv4(),
              bpp_id: bppId,
              bpp_uri: bppUri,
              domain: DOMAIN
            },
            message: {
              order_id: orderId,
              orderId: orderId
            }
          }
        ]
      }

      axios
        .post(`${apiUrl}/status`, payload)
        .then(async res => {
          const { stops, state } = res.data.data[0].message.order.fulfillments[0]
          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_STARTED) {
            setRideStartedAlert(true)
            dispatch(
              feedbackActions.setToastData({
                toastData: {
                  message: 'Info',
                  display: true,
                  type: 'info',
                  description: 'Ride Started.'
                }
              })
            )
          }
          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_COMPLETED) {
            dispatch(setDriverCurrentLocation(dropoff.geoLocation))
            dispatch(setPickUpLocation({ address: '', geoLocation: { latitude: 0, longitude: 0 } }))
            dispatch(setDropOffLocation({ address: '', geoLocation: { latitude: 0, longitude: 0 } }))
            router.push('/feedback')
          }
          // stops.forEach((element: any) => {
          //   if (element.type === 'start') {
          //     const locationDetails = formatGeoLocationDetails('', element.location.gps)
          //     dispatch(setDriverCurrentLocation(locationDetails.geoLocation))
          //   }
          // })
        })
        .catch(e => {
          console.error(e)
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
        })
    }
  }

  useEffect(() => {
    getRideStatus()
    const intervalId = setInterval(getRideStatus, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      {/* {rideStartedAlert && <Box>{'Ride Started'}</Box>} */}
      {isLoading ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'300px'}
        >
          <LoaderWithMessage
            loadingText={t.pleaseWait}
            loadingSubText={'while we recompute the fare'}
          />
        </Box>
      ) : (
        <>
          {rideDetails && (
            <RideDetails
              name={rideDetails?.name}
              registrationNumber={rideDetails?.registrationNumber}
              carModel={rideDetails?.carModel}
              rating={rideDetails?.rating}
              contact={rideDetails?.contact}
              fare={rideDetails?.price!}
              pickUp={pickup}
              dropOff={dropoff}
              color={'Black'}
              otp={''}
              cancelRide={handleCancelRide}
              contactSupport={handleContactSupport}
              handleEditDropoff={() => setOpenAlert(true)}
            />
          )}
          {openAlert && (
            <DropOffChangeAlertModal
              isOpen={true}
              handleOnClose={() => setOpenAlert(false)}
              handleAlertSubmit={handleAlertSubmit}
            />
          )}
        </>
      )}
    </>
  )
}

export default RideDetailsContainer
