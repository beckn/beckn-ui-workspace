import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { RideSummaryHeaderProps } from './rideSummaryType'

const RideSummaryHeader: React.FC<RideSummaryHeaderProps> = ({ driverImg, title, subTitle }) => {
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
            />
            <Box
              alignItems={'left'}
              ml="22px"
            >
              <Box
                fontSize="17px"
                fontWeight="500"
                mb="8px"
              >
                {title}
              </Box>
              <Box fontSize="12px">{subTitle}</Box>
            </Box>
          </Flex>
          <Image
            h={'44px'}
            w="44px"
            borderRadius={'50%'}
            src={driverImg}
            alt=""
          />
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
