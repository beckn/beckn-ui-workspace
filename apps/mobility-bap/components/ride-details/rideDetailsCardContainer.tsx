import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
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
import { clearDestination, clearSource, feedbackActions, setSource } from '@beckn-ui/common'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useRouter } from 'next/router'
import RideDetailsContainer from './rideDetailsContainer'
import CancelRide from '@components/cancel-ride/cancelRidePage'
import ContactSupport from '@components/contact-support/contactSupport'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type ModalType = 'Cancel' | 'ContactSupport' | 'RideSummary' | 'RideDetails'

interface RideDetailsCardContainerProps {
  handleOnDecline: () => void
}

const RideDetailsCardContainer: React.FC<RideDetailsCardContainerProps> = ({ handleOnDecline }) => {
  const [rideStartedAlert, setRideStartedAlert] = useState<boolean>(false)
  const [rideDetails, setRideDetails] = useState<RideDetailsProps | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentRideStatus, setCurrentRideStatus] = useState<RIDE_STATUS_CODE>()
  const [modalType, setModalType] = useState<ModalType>()

  const alertCount = useRef<number>(0)
  const selectedOrderData = useRef<any>()

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()

  const [confirm] = useConfirmMutation()
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)
  // const initResponse = useSelector((state: SelectRideRootState) => state.selectRide.initResponse)
  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  // useEffect(() => {
  //   if (initResponse?.length) {
  //     const payLoad = getConfirmPayload(initResponse[0])
  //     confirm(payLoad)
  //   }
  // }, [initResponse])

  useEffect(() => {
    if (confirmResponse.length > 0) {
      const orderId = confirmResponse[0].message.orderId
      const bppId = confirmResponse[0].context.bpp_id
      const bppUri = confirmResponse[0].context.bpp_uri

      const orderObjectForStatusCall = { bppId: bppId, bppUri: bppUri, orderId: orderId }
      selectedOrderData.current = orderObjectForStatusCall
    }
  }, [confirmResponse])

  const getRideStatus = () => {
    if (selectedOrderData.current) {
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
          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_ACCEPTED && confirmResponse.length > 0) {
            const { message } = confirmResponse[0] || {}
            const { agent, vehicle, rating } = message?.fulfillments?.find(fulfillment => fulfillment.agent)!
            setRideDetails({
              name: agent?.person.name!,
              registrationNumber: vehicle?.registration!,
              carModel: `${vehicle?.make!} ${vehicle?.model!}`,
              rating: rating!,
              contact: agent?.contact.phone!
            })

            setIsLoading(false)
            setModalType('RideSummary')
          }

          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_STARTED && alertCount.current === 0) {
            setRideStartedAlert(true)
            dispatch(
              feedbackActions.setToastData({
                toastData: {
                  message: 'Info',
                  display: true,
                  type: 'success',
                  description: 'Ride Started.'
                }
              })
            )
            alertCount.current++
            setModalType('RideDetails')
          }

          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_DECLINED) {
            setRideStartedAlert(true)
            dispatch(
              feedbackActions.setToastData({
                toastData: {
                  message: 'Info',
                  display: true,
                  type: 'error',
                  description: 'Driver Decline the Ride.'
                }
              })
            )
            handleOnDecline()
          }
          if (state?.descriptor?.short_desc === RIDE_STATUS_CODE.RIDE_COMPLETED) {
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
          }
          setCurrentRideStatus(state?.descriptor?.short_desc)
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
          {rideDetails && modalType === 'RideSummary' && (
            <RideDetailsCard
              name={rideDetails?.name!}
              registrationNumber={rideDetails?.registrationNumber!}
              carModel={rideDetails?.carModel!}
              rating={rideDetails?.rating!}
              contact={rideDetails?.contact!}
            />
          )}
          {rideDetails && modalType === 'RideDetails' && (
            <RideDetailsContainer
              handleCancelRide={() => setModalType('Cancel')}
              handleContactSupport={() => setModalType('ContactSupport')}
            />
          )}
          {modalType === 'ContactSupport' && <ContactSupport handleOnClose={() => setModalType('RideDetails')} />}
          {modalType === 'Cancel' && <CancelRide handleOnClose={() => setModalType('RideDetails')} />}
        </>
      )}
    </>
  )
}

export default RideDetailsCardContainer
