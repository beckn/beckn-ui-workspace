import React from 'react'

import { Flex, Image, Box, Button } from '@chakra-ui/react'
// import { Button } from '@beckn-ui/molecules'
import { StarIcon } from '@chakra-ui/icons'

import { Typography } from '@beckn-ui/molecules'
import { DriverDetailsProps } from './RideDetails.types'

const DriverDetails: React.FC<DriverDetailsProps> = ({ name, rating, contact, driverImage }) => {
  const handleCallClick = () => {
    const telLink = `tel:${contact}`
    window.open(telLink, '_blank')
  }
  return (
    <Flex
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      mb={'20px'}
    >
      <Box
        as={Flex}
        gap={'10px'}
        alignItems={'center'}
      >
        <Image
          src={driverImage}
          alt="driver-image"
          h={'50px'}
          w={'50px'}
        />
        <Flex direction={'column'}>
          <Typography
            text={name}
            fontSize="14px"
            fontWeight="700"
          />
          <Flex
            alignItems={'center'}
            gap={'4px'}
            mt={'5px'}
          >
            <Typography
              text={rating}
              fontSize="14px"
              fontWeight="700"
            />
            <StarIcon
              color={'#FADB14'}
              w={'12px'}
              h={'12px'}
              mb={'2px'}
            />
          </Flex>
        </Flex>
      </Box>

      <Image
        src="./images/callIcon.svg"
        alt="contact-image"
        h={'50px'}
        w={'50px'}
        onClick={handleCallClick}
      />
    </Flex>
  )
}

export default DriverDetails
