import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import RideDetailsCard from './RideDetailsCard'
import { useDispatch, useSelector } from 'react-redux'
import { SelectRideRootState } from '@store/selectRide-slice'
import { RideDetailsProps } from '@lib/types/cabService'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { DOMAIN } from '@lib/config'
import axios from '@services/axios'
import { v4 as uuidv4 } from 'uuid'
import { RIDE_STATUS_CODE } from '@utils/general'
import { setDropOffLocation, setPickUpLocation } from '@store/user-slice'
import { clearDestination, feedbackActions, setSource, ToastType } from '@beckn-ui/common'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useRouter } from 'next/router'
import RideDetailsContainer from './rideDetailsContainer'
import CancelRide from '@components/cancel-ride/cancelRidePage'
import ContactSupport from '@components/contact-support/contactSupport'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type ModalType = 'Cancel' | 'ContactSupport' | 'RideSummary' | 'RideDetails'

interface RideDetailsCardContainerProps {
  handleStatusOperation: (status: RIDE_STATUS_CODE) => void
}

const RideDetailsCardContainer: React.FC<RideDetailsCardContainerProps> = ({ handleStatusOperation }) => {
  const [rideDetails, setRideDetails] = useState<RideDetailsProps | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modalType, setModalType] = useState<{ type: ModalType; prev?: ModalType }>()

  const currentRideStatus = useRef<RIDE_STATUS_CODE>()
  const selectedOrderData = useRef<any>()

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()

  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)
  const { dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  useEffect(() => {
    if (confirmResponse.length > 0) {
      const orderId = confirmResponse[0].message.orderId
      const bppId = confirmResponse[0].context.bpp_id
      const bppUri = confirmResponse[0].context.bpp_uri

      const orderObjectForStatusCall = { bppId: bppId, bppUri: bppUri, orderId: orderId }
      selectedOrderData.current = orderObjectForStatusCall
    }
  }, [confirmResponse])

  const handleStateChange = (message: string, type: 'success' | 'error') => {
    dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Info', display: true, type, description: message }
      })
    )
  }

  const getRideStatus = () => {
    if (!selectedOrderData.current) return

    const { bppId, bppUri, orderId } = selectedOrderData.current
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
        const currentStatus = state?.descriptor?.short_desc

        if (confirmResponse.length > 0 && currentStatus !== currentRideStatus.current) {
          console.log(currentStatus, currentRideStatus)
          const { message } = confirmResponse[0]
          const { agent, vehicle, rating } = message?.fulfillments?.find(fulfillment => fulfillment.agent)!
          setRideDetails({
            name: agent?.person.name!,
            registrationNumber: vehicle?.registration!,
            carModel: `${vehicle?.make!} ${vehicle?.model!}`,
            rating: rating!,
            contact: agent?.contact.phone!
          })
          currentRideStatus.current = currentStatus

          switch (currentStatus) {
            case RIDE_STATUS_CODE.RIDE_ACCEPTED:
            case RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION:
              setIsLoading(false)
              setModalType({ type: 'RideSummary' })
              handleStateChange(
                currentStatus === RIDE_STATUS_CODE.RIDE_ACCEPTED ? 'Ride Accepted.' : 'Driver reached PickUp location.',
                'success'
              )
              break

            case RIDE_STATUS_CODE.RIDE_STARTED:
              setIsLoading(false)
              handleStateChange('Ride Started.', 'success')
              setModalType({ type: 'RideDetails' })
              break

            case RIDE_STATUS_CODE.RIDE_DECLINED:
              setIsLoading(false)
              handleStateChange('Driver Declined the Ride.', 'error')
              handleStatusOperation(RIDE_STATUS_CODE.RIDE_DECLINED)
              break

            case RIDE_STATUS_CODE.RIDE_COMPLETED:
              setIsLoading(false)
              handleStatusOperation(RIDE_STATUS_CODE.RIDE_COMPLETED)
              const currentLocation = { address: dropoff.address, geoLocation: dropoff.geoLocation }
              dispatch(setPickUpLocation(currentLocation))
              dispatch(setDropOffLocation({ address: '', geoLocation: { latitude: 0, longitude: 0 } }))
              dispatch(
                setSource({
                  geoAddress: currentLocation.address,
                  geoLatLong: `${currentLocation.geoLocation.latitude},${currentLocation.geoLocation.longitude}`
                })
              )
              dispatch(clearDestination())
              router.push('/feedback')
              break

            default:
              break
          }
        }
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

  useEffect(() => {
    getRideStatus()
    const intervalId = setInterval(getRideStatus, 5000)

    return () => clearInterval(intervalId)
  }, [selectedOrderData.current])

  return (
    <>
      {isLoading ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'300px'}
        >
          <LoaderWithMessage
            loadingText={t.pleaseWait}
            loadingSubText={t.confirmLoaderSubtext}
          />
        </Box>
      ) : (
        <>
          {rideDetails && modalType?.type === 'RideSummary' && (
            <RideDetailsCard
              name={rideDetails?.name!}
              registrationNumber={rideDetails?.registrationNumber!}
              carModel={rideDetails?.carModel!}
              rating={rideDetails?.rating!}
              contact={rideDetails?.contact!}
              cancelRide={() => setModalType({ type: 'Cancel' })}
              contactSupport={() => setModalType({ type: 'ContactSupport', prev: 'RideSummary' })}
            />
          )}
          {rideDetails && modalType?.type === 'RideDetails' && (
            <RideDetailsContainer
              handleContactSupport={() => setModalType({ type: 'ContactSupport', prev: 'RideDetails' })}
            />
          )}
          {modalType?.type === 'ContactSupport' && (
            <ContactSupport handleOnClose={() => setModalType({ type: modalType.prev! })} />
          )}
          {modalType?.type === 'Cancel' && <CancelRide handleOnClose={() => setModalType({ type: 'RideSummary' })} />}
        </>
      )}
    </>
  )
}

export default RideDetailsCardContainer
