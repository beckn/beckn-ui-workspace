import React from 'react'
import { Box, Divider, Flex, Image, useTheme } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PickUpDropOffModel } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'

const TripLocation = ({
  pickupLocation,
  dropLocation,
  handleEditDropoff
}: {
  pickupLocation: PickUpDropOffModel
  dropLocation: PickUpDropOffModel
  handleEditDropoff?: () => void
}) => {
  const theme = useTheme()
  return (
    <>
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        mb={'12px'}
        alignItems="center"
      >
        <Image
          height={'18px'}
          w="18px"
          maxW={'unset'}
          src="./images/locationIcon.svg"
          alt=""
        />
        <Flex
          ml={'10px'}
          mr="5px"
          alignItems={'center'}
        >
          <Typography
            text="Pickup"
            fontSize="15px"
            fontWeight="400"
            dataTest={testIds.mobility_pickup_label}
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
          dataTest={testIds.mobility_pickup_address}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal'
          }}
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
          alignItems="center"
        >
          <Image
            height={'18px'}
            w="18px"
            maxW={'unset'}
            src="./images/locationIcon.svg"
            alt=""
          />
          <Flex
            ml={'10px'}
            mr="5px"
            alignItems={'center'}
          >
            <Typography
              text="Dropoff"
              fontSize="15px"
              fontWeight="400"
              dataTest={testIds.mobility_dropoff_label}
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
            dataTest={testIds.mobility_dropoff_address}
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal'
            }}
          />
        </Flex>
        {handleEditDropoff && (
          <Box>
            <Typography
              text="Edit"
              fontWeight="500"
              fontSize="15px"
              color={theme.colors.primary['100']}
              onClick={handleEditDropoff}
            />
          </Box>
        )}
      </Flex>
    </>
  )
}

export default TripLocation
