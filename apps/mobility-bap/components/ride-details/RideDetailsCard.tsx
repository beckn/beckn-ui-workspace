import React from 'react'
import { Divider } from '@chakra-ui/react'

import DriverDetails from './DriverDetails'
import CabDetails from './CabDetails'

import { RideDetailsCardProps } from './RideDetails.types'
import BottomDrawer from '../bottomDrawer/BottomDrawer'

const RideDetailsCard: React.FC<RideDetailsCardProps> = ({ name, contact, registrationNumber, carModel, rating }) => {
  return (
    <BottomDrawer>
      <CabDetails
        registrationNumber={registrationNumber}
        carModel={carModel}
      />
      <Divider
        mb="20px"
        mt="18px"
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
      />
      <DriverDetails
        name={name}
        rating={rating}
        contact={contact}
        driverImage={'./images/driverImage.svg'}
      />
    </BottomDrawer>
  )
}

export default RideDetailsCard
