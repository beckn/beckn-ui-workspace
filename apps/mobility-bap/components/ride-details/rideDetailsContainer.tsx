import { GeoLocationType, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import DropOffChangeAlertModal from '@components/dropOffChangeAlertModal/dropOffChangeAlertModal'
import { useLanguage } from '@hooks/useLanguage'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import RideDetails from './RideDetails'

interface RideDetailsContainerProps {
  handleCancelRide: () => void
  handleContactSupport: () => void
}

const RideDetailsContainer: React.FC<RideDetailsContainerProps> = ({ handleCancelRide, handleContactSupport }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch()
  const { t } = useLanguage()

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
            name={'John Doe'}
            registrationNumber={'XYZ 1234'}
            carModel={'Toyota Camry'}
            color={'Black'}
            rating={'4.8'}
            fare={'₹80'}
            pickUp={'Katraj'}
            dropOff={'Phoenix Mall'}
            otp={'123456'}
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
