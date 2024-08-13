import { GeoLocationType, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import DropOffChangeAlertModal from '@components/dropOffChangeAlertModal/dropOffChangeAlertModal'
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import RideDetails from './RideDetails'
import RideDetailsCard from './RideDetailsCard'
import { useSelector } from 'react-redux'
import { UserGeoLocationRootState } from '@lib/types/user'
import { RideDetailsProps } from '@lib/types/cabService'
import { SelectRideRootState } from '@store/selectRide-slice'
import Loader from '@components/loader/Loader'
import { Box } from '@chakra-ui/react'

interface RideDetailsContainerProps {
  handleCancelRide: () => void
  handleContactSupport: () => void
}

const RideDetailsContainer: React.FC<RideDetailsContainerProps> = ({ handleCancelRide, handleContactSupport }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)
  const [rideDetails, setRideDetails] = useState<RideDetailsProps>({
    name: '',
    carModel: '',
    contact: '',
    rating: '',
    registrationNumber: ''
  })
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)

  const dispatch = useDispatch()
  const { t } = useLanguage()

  useEffect(() => {
    if (confirmResponse.length) {
      setIsLoading(true)
      const { message } = confirmResponse[0] || {}
      const { agent, vehicle, rating } = message?.fulfillments?.find(fulfillment => fulfillment.agent)!
      setRideDetails({
        name: agent.person.name,
        registrationNumber: vehicle.registration,
        carModel: `${vehicle.make} ${vehicle.model}`,
        rating: rating,
        contact: agent.contact.phone,
        price: message.quote?.price?.value
      })
      setIsLoading(false)
    }
  }, [confirmResponse])

  const handleAlertSubmit = (addressType: GeoLocationType) => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }

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
            loadingSubText={'while we recompute the fare'}
          />
        </Box>
      ) : (
        <>
          <RideDetails
            name={rideDetails?.name}
            registrationNumber={rideDetails?.registrationNumber}
            carModel={rideDetails.carModel}
            rating={rideDetails.rating}
            contact={rideDetails.contact}
            fare={rideDetails.price!}
            pickUp={pickup}
            dropOff={dropoff}
            color={'Black'}
            otp={''}
            cancelRide={handleCancelRide}
            contactSupport={handleContactSupport}
            handleEditDropoff={() => setOpenAlert(true)}
          />
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
