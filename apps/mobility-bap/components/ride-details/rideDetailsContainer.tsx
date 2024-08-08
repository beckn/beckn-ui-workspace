import React from 'react'
import RideDetails from './RideDetails'
import RideDetailsCard from './RideDetailsCard'

interface RideDetailsContainerProps {
  handleCancelRide: () => void
  handleContactSupport: () => void
}

const RideDetailsContainer: React.FC<RideDetailsContainerProps> = ({ handleCancelRide, handleContactSupport }) => {
  return (
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
      />
    </>
  )
}

export default RideDetailsContainer
