import React from 'react'
import { Divider, Image } from '@chakra-ui/react'

import DriverDetails from './DriverDetails'
import CabDetails from './CabDetails'

import { RideDetailsCardProps } from './RideDetails.types'
import BottomDrawer from '../bottomDrawer/BottomDrawer'
import { Button } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'

const RideDetailsCard: React.FC<RideDetailsCardProps> = ({
  name,
  contact,
  registrationNumber,
  carModel,
  rating,
  cancelRide,
  contactSupport
}) => {
  const { t } = useLanguage()

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
      <Button
        text="Contact Support"
        leftIcon={
          <Image
            src="./images/contactSupport.svg"
            alt="contact-support"
          />
        }
        handleClick={contactSupport}
      />
      <Button
        text={t.cancelRide}
        handleClick={cancelRide}
        variant="outline"
      />
    </BottomDrawer>
  )
}

export default RideDetailsCard
