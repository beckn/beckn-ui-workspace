import RideDetails from '@components/ride-details/RideDetails'
import React from 'react'
import { mockData } from '@utils/cabDetails'

const rideDetailsForm = () => {
  const {
    data: [
      {
        cabCategory: {
          mini: {
            cabDetails: { fare }
          }
        },
        chaufferDetails: { name, registrationNumber, carModel, color, rating },
        location: { pickup, dropOff }
      }
    ]
  } = mockData

  return (
    <>
      <RideDetails
        name={name}
        registrationNumber={registrationNumber}
        carModel={carModel}
        color={color}
        rating={rating}
        fare={fare}
        pickUp={pickup}
        dropOff={dropOff}
        otp={''}
        // fare=""
      />
    </>
  )
}

export default rideDetailsForm
