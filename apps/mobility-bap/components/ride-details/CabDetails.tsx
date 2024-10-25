import React from 'react'

import { Flex, useTheme } from '@chakra-ui/react'

import { Typography } from '@beckn-ui/molecules'
import { CabDetailsProps } from './RideDetails.types'

const CabDetails: React.FC<CabDetailsProps> = ({ registrationNumber, carModel, color, otp }) => {
  const theme = useTheme()
  const carDetails = color ? `${carModel}, ${color}` : carModel
  return (
    <Flex
      direction="row"
      alignItems="center"
      mb={'10px'}
      mt={'5px'}
      justifyContent={'space-between'}
    >
      <Flex direction={'column'}>
        <Typography
          text={registrationNumber}
          dataTest={'registrationNumber'}
          fontSize="14px"
          fontWeight="700"
        />
        <Typography
          text={carDetails}
          dataTest={'carDetails'}
          fontSize="11px"
          fontWeight="400"
          color="#37474F"
        />
      </Flex>
      <Flex
        direction={'column'}
        alignItems={'center'}
      >
        <Typography
          text={otp}
          fontSize="14px"
          fontWeight="700"
          color={theme.colors.primary[100]}
        />
        {otp ? (
          <Typography
            text="OTP"
            fontSize="11px"
            fontWeight="400"
            color="#37474F"
          />
        ) : (
          ''
        )}
      </Flex>
    </Flex>
  )
}

export default CabDetails
