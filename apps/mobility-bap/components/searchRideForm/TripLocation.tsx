import React from 'react'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PickUpDropOffModel } from '@beckn-ui/common'

const TripLocation = ({
  pickupLocation,
  dropLocation
}: {
  pickupLocation: PickUpDropOffModel
  dropLocation: PickUpDropOffModel
}) => {
  return (
    <>
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        mb={'12px'}
      >
        <Image
          src="./images/locationIcon.svg"
          alt=""
        />
        <Flex
          ml={'20px'}
          mr="5px"
        >
          <Typography
            text="Pickup"
            fontSize="15px"
            fontWeight="400"
          />
          <Box
            as="span"
            ml="5px"
          >
            :
          </Box>
        </Flex>
        <Typography
          text={pickupLocation?.address}
          fontWeight="500"
          fontSize="15px"
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        />
      </Flex>
      <Divider
        mb={'20px'}
        mt="20px"
      />
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        mb={'12px'}
      >
        <Image
          src="./images/locationIcon.svg"
          alt=""
        />
        <Flex
          ml={'20px'}
          mr="5px"
        >
          <Typography
            text="Dropoff"
            fontSize="15px"
            fontWeight="400"
          />
          <Box
            as="span"
            ml="5px"
          >
            :
          </Box>
        </Flex>
        <Typography
          text={dropLocation?.address}
          fontWeight="500"
          fontSize="15px"
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        />
      </Flex>
    </>
  )
}

export default TripLocation
