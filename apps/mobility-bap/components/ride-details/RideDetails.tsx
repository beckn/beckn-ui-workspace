import React from 'react'
import { Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { Button } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'
import { RideDetailsProps } from './RideDetails.types'
import BottomDrawer from '../bottomDrawer/BottomDrawer'
import TripLocation from '../searchRideForm/TripLocation'
import CabDetails from './CabDetails'
import DriverDetails from './DriverDetails'
import { useLanguage } from '@hooks/useLanguage'
import { getCurrencyValue, getDistance } from '@utils/general'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useSelector } from 'react-redux'

const RideDetails: React.FC<RideDetailsProps> = ({
  name,
  registrationNumber,
  carModel,
  color,
  rating,
  fare,
  contact,
  pickUp,
  dropOff,
  cancelRide,
  contactSupport,
  handleEditDropoff
}) => {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useLanguage()

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  const getTotalFare = (fare: string) => {
    const distance = getDistance(pickup, dropoff)
    return (Number(fare) * distance).toFixed(2)
  }

  const experienceType = JSON.parse(localStorage.getItem('experienceType')!)

  return (
    <BottomDrawer>
      <CabDetails
        registrationNumber={registrationNumber}
        carModel={carModel}
        color={color}
        otp={''}
      />
      <Divider
        mb="20px"
        mt="8px"
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
      />
      <DriverDetails
        name={name}
        rating={rating}
        driverImage={'./images/driverImage.svg'}
        contact={contact}
      />
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={'15px'}
      >
        <Flex direction={'column'}>
          <Typography
            text={t.totalFare}
            fontSize="11px"
            fontWeight="400"
            color="#37474F"
          />
          <Typography
            text={`${getCurrencyValue(experienceType)}${getTotalFare(fare.toString())}`}
            fontSize="14px"
            fontWeight="700"
          />
        </Flex>
        <Flex
          justifyContent={'space-between'}
          gap={'10px'}
        >
          <Typography
            text={'Payment'}
            fontSize="12px"
            fontWeight="400"
            color="#37474F"
          />
          <Flex
            direction={'column'}
            textAlign="end"
          >
            <Flex
              gap={'5px'}
              mb="8px"
            >
              <Image
                src="./images/cash.svg"
                alt="payment-method"
                h={'16px'}
                w={'25px'}
              />
              <Typography
                text={t.cashText}
                fontWeight="700"
                fontSize="12px"
              />
            </Flex>
            {/* <Typography
              text={'Change'}
              fontWeight="700"
              fontSize="12px"
              color={theme.colors.primary['100']}
            /> */}
          </Flex>
        </Flex>
      </Flex>
      <Divider
        mb="20px"
        mt="18px"
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
      />
      <TripLocation
        pickupLocation={{ address: pickUp.address, geoLocation: { latitude: 0, longitude: 0 } }}
        dropLocation={{ address: dropOff.address, geoLocation: { latitude: 0, longitude: 0 } }}
        //handleEditDropoff={handleEditDropoff}
      />
      <Divider
        mb="30px"
        mt="18px"
        w={'unset'}
        mr="-20px"
        ml="-20px"
        borderBottomWidth={'2px'}
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

export default RideDetails
