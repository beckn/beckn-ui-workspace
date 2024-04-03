import TripLocation from '@/components/searchRideForm/TripLocation'
import { Image, Box, Card, CardBody, Divider, Flex } from '@chakra-ui/react'
import { IGeoLocationSearchPageRootState } from 'lib/types/geoLocationSearchPage'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const SearchRide = () => {
  const MapWithNoSSR = dynamic(() => import('../components/Map'), {
    ssr: false
  })

  const pickupAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.pickupAddress
  )
  const coords = useSelector((state: IGeoLocationSearchPageRootState) => ({
    lat: state.geoLocationSearchPageUI.geoLatLong?.lat,
    long: state.geoLocationSearchPageUI.geoLatLong?.long
  }))

  const dropoffAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.dropoffAddress
  )

  console.log(coords)

  return (
    <Box>
      <MapWithNoSSR coords={coords} />
      <Card
        zIndex={'999'}
        position="absolute"
        top={'68px'}
        w="100%"
        borderRadius={'unset'}
        borderTop="2px solid #00000012"
        boxShadow="0px 4px 4px 0px #00000040"
      >
        <CardBody padding={'20px 20px 10px 20px'}>
          <Flex
            fontSize={'15px'}
            alignItems={'center'}
          >
            <Image
              src="./images/backIcon.svg"
              alt=""
              onClick={() => Router.back()}
            />

            <Box
              ml={'20px'}
              fontSize={'18px'}
              fontWeight="400"
            >
              Select Ride
            </Box>
          </Flex>
          <Divider mt="20px" />

          <Divider mb="20px" />
          <TripLocation
            pickupLocation={pickupAddress}
            dropLocation={dropoffAddress}
          />
          {/* <Flex
            fontSize={'15px'}
            fontWeight="500"
            alignItems={'center'}
          >
            <Image
              src="./images/locationIcon.svg"
              alt=""
            />
            <Flex
              ml={'20px'}
              mr="5px"
            >
              Pickup
              <Box
                as="span"
                ml="5px"
              >
                :
              </Box>
            </Flex>
            <Box
              fontWeight="600"
              whiteSpace={'nowrap'}
              overflow="hidden"
              textOverflow={'ellipsis'}
            >
              {pickupAddress}
            </Box>
          </Flex>
          <Divider
            mb="20px"
            mt="20px"
          />
          <Flex
            fontSize={'15px'}
            fontWeight="500"
          >
            <Image
              src="./images/locationIcon.svg"
              alt=""
            />
            <Flex
              ml={'20px'}
              mr="5px"
            >
              Dropoff{' '}
              <Box
                as="span"
                ml="5px"
              >
                :
              </Box>
            </Flex>

            <Box
              fontWeight="600"
              whiteSpace={'nowrap'}
              overflow="hidden"
              textOverflow={'ellipsis'}
            >
              {dropoffAddress}
            </Box>
          </Flex> */}
        </CardBody>
      </Card>
    </Box>
  )
}

export default SearchRide
