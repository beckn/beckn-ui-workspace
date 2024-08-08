import React from 'react'
import RideDetailsCard from './RideDetailsCard'

interface RideDetailsCardContainerProps {
  handleOnClick: () => void
}

const RideDetailsCardContainer: React.FC<RideDetailsCardContainerProps> = ({ handleOnClick }) => {
  return (
    <RideDetailsCard
      name={'John Doe'}
      registrationNumber={'XYZ 1234'}
      carModel={'Toyota Camry'}
      color={'Black'}
      otp={'123456'}
      rating={'4.8'}
      onClick={handleOnClick}
    />
  )
}

export default RideDetailsCardContainer
