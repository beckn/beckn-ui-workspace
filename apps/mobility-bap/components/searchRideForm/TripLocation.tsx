import React from 'react'
import { Box, Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PickUpDropOffModel } from '@beckn-ui/common'

const TripLocation = ({
  pickupLocation,
  dropLocation,
  handleEditDropoff
}: {
  pickupLocation: PickUpDropOffModel
  dropLocation: PickUpDropOffModel
  handleEditDropoff: () => void
}) => {
  const theme = useTheme()
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
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '12rem' }}
        />
      </Flex>
      <Divider
        mb={'20px'}
        mt="20px"
      />
      <Flex justifyContent={'space-between'}>
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
            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '12rem' }}
          />
        </Flex>
        <Box>
          <Typography
            text="Edit"
            fontWeight="500"
            fontSize="15px"
            color={theme.colors.primary['100']}
            onClick={handleEditDropoff}
          />
        </Box>
      </Flex>
    </>
  )
}

export default TripLocation
