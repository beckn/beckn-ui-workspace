import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image, theme } from '@chakra-ui/react'
import { RideDetailsProps } from '@lib/types/rideDetails'
import React from 'react'

const RideDetails: React.FC<RideDetailsProps> = ({ img, riderName, date, time, fare, status }) => {
  return (
    <DetailCard>
      <Flex alignItems={'center'}>
        <Box
          mr="12px"
          height={'80px'}
          w="80px"
          borderRadius={'6px'}
        >
          <Image
            src={img ? img : '/images/carImage.svg'}
            alt={''}
          />
        </Box>
        <Box w="calc(100% - 80px)">
          <Typography
            text={riderName}
            fontSize="15px"
            fontWeight="500"
          />
          <Flex
            mb="10px"
            mt="10px"
            fontSize={'12px'}
            alignItems="center"
            opacity={0.6}
          >
            <Typography
              text={date}
              style={{ paddingRight: '10px' }}
            />
            |
            <Typography
              text={time}
              style={{ paddingLeft: '10px' }}
            />
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              text={fare}
              color={'#73B9FA'}
              fontSize="12px"
              fontWeight="500"
            />
            <Typography
              text={status}
              fontSize="12px"
              fontWeight="500"
              color={status === 'Completed' ? '#5EC401' : '#E9C058'}
            />
          </Flex>
        </Box>
      </Flex>
    </DetailCard>
  )
}
export default RideDetails
