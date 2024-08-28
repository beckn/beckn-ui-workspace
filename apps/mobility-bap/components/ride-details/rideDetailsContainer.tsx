import { GeoLocationType, feedbackActions, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
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
import axios from '@services/axios'
import { useRouter } from 'next/router'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface RideDetailsContainerProps {
  // handleCancelRide: () => void
  handleContactSupport: () => void
}

const RideDetailsContainer: React.FC<RideDetailsContainerProps> = ({ handleContactSupport }) => {
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

  // useEffect( () => {
  //     handleUpdate()
  //   }, [dropoff]);

  const handleUpdate = async () => {
    setIsLoading(true)
    if (confirmResponse && confirmResponse.length > 0) {
      const { domain, bpp_id, bpp_uri, transaction_id } = confirmResponse[0].context
      const orderId = confirmResponse[0].message.orderId
      const dropOffGps = `${dropoff.geoLocation.latitude},${dropoff.geoLocation.longitude}`
      const pickUpGps = `${pickup.geoLocation.latitude},${pickup.geoLocation.longitude}`
      console.log('Dropoff coordinates: ', dropOffGps)
      const updateRequestPayload = {
        data: [
          {
            context: {
              domain,
              bpp_id,
              bpp_uri,
              transaction_id
            },
            orderId,
            updateDetails: {
              updateTarget: 'order.fulfillments[0].stops[1]',
              fulfillments: [
                {
                  stops: [
                    {
                      location: {
                        gps: pickUpGps
                      }
                    },
                    {
                      location: {
                        gps: dropOffGps
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
      console.log('Update req payload: ', updateRequestPayload)
      const updateResponse = await axios.post(`${apiUrl}/update`, updateRequestPayload)
      if (updateResponse.data.data.length > 0) {
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: t.success,
              display: true,
              type: 'success',
              description: t.destinationUpdatedSuccessfully
            }
          })
        )
        setIsLoading(false)
      }
    }
  }

  const handleAlertSubmit = (addressType: GeoLocationType) => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }

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
