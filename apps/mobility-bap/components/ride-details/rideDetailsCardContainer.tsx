import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import Loader from '@components/loader/Loader'
import { useLanguage } from '../../hooks/useLanguage'
import RideDetailsCard from './RideDetailsCard'
import { useSelector } from 'react-redux'
import { SelectRideRootState } from '@store/selectRide-slice'
import { getConfirmPayload } from '@utils/payload'
import { RideDetailsProps } from '@lib/types/cabService'

interface RideDetailsCardContainerProps {
  handleOnClick: () => void
}

const RideDetailsCardContainer: React.FC<RideDetailsCardContainerProps> = ({ handleOnClick }) => {
  const { t } = useLanguage()
  const [confirm, { isLoading }] = useConfirmMutation()
  const [rideDetails, setRideDetails] = useState<RideDetailsProps | null>(null)
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)
  const initResponse = useSelector((state: SelectRideRootState) => state.selectRide.initResponse)

  useEffect(() => {
    if (initResponse?.length) {
      const payLoad = getConfirmPayload(initResponse[0])
      confirm(payLoad)
    }
  }, [initResponse])

  useEffect(() => {
    if (confirmResponse.length) {
      const { message } = confirmResponse[0] || {}
      const { agent, vehicle, rating } = message?.fulfillments?.find(fulfillment => fulfillment.agent)!
      setRideDetails({
        name: agent.person.name,
        registrationNumber: vehicle.registration,
        carModel: `${vehicle.make} ${vehicle.model}`,
        rating: rating,
        contact: agent.contact.phone
      })
    }
  }, [confirmResponse])

  if (isLoading || !confirmResponse || !rideDetails) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader
          loadingText={t.pleaseWait}
          subLoadingText={t.confirmLoaderSubtext}
        />
      </Box>
    )
  }
  return (
    <RideDetailsCard
      name={rideDetails?.name}
      registrationNumber={rideDetails?.registrationNumber}
      carModel={rideDetails.carModel}
      rating={rideDetails.rating}
      contact={rideDetails.contact}
      onClick={handleOnClick}
    />
  )
}

export default RideDetailsCardContainer
