import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { RideSummaryHeaderProps } from '../../lib/types/rideDetails'

const RideSummaryHeader: React.FC<RideSummaryHeaderProps> = ({
  driverImg,
  title,
  subTitle,
  customerContact,
  dataTest
}) => {
  const handleCallClick = () => {
    const telLink = `tel:${customerContact}`
    window.open(telLink, '_blank')
  }
  return (
    <>
      {driverImg ? (
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
          w={'100%'}
        >
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Image
              src="/images/car.svg"
              alt="car"
              data-test="ride-summary-header-img"
            />
            <Box
              alignItems={'left'}
              ml="22px"
            >
              <Box
                fontSize="17px"
                fontWeight="500"
                mb="8px"
                data-test={dataTest}
              >
                {title}
              </Box>
              <Box
                fontSize="12px"
                data-test="header-sub-title"
              >
                {subTitle}
              </Box>
            </Box>
          </Flex>
          <Box
            position={'relative'}
            cursor="pointer"
            onClick={handleCallClick}
            data-test="driver-call-click"
          >
            <Image
              h={'44px'}
              w="44px"
              borderRadius={'50%'}
              src={driverImg ? driverImg : '/images/blankImg.svg'}
              alt=""
              data-test="driver-img"
            />
            <Image
              position={'absolute'}
              bottom="-5px"
              right={'0'}
              src={'/images/phoneIcon.svg'}
              alt=""
              data-test="driver-call-img"
            />
          </Box>
        </Flex>
      ) : (
        <Box
          fontSize="17px"
          fontWeight="500"
          mb="8px"
        >
          {title}
        </Box>
      )}
    </>
  )
}

export default RideSummaryHeader
