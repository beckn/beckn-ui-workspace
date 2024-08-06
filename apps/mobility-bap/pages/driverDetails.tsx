import React from 'react'
import { useRouter } from 'next/router'
import { mockData } from '@utils/cabDetails'
import RideDetailsCard from '@components/ride-details/RideDetailsCard'

const driverDetails = () => {
  const router = useRouter()
  const {
    data: [
      {
        chaufferDetails: { name, registrationNumber, carModel, color, otp, rating }
      }
    ]
  } = mockData

  return (
    <RideDetailsCard
      name={name}
      registrationNumber={registrationNumber}
      carModel={carModel}
      color={color}
      otp={otp}
      rating={rating}
      onClick={() => router.push('/rideDetailsForm')}
    />
  )
}

export default driverDetails
