import TripLocation from '@/components/searchRideForm/TripLocation'
import { Button, Typography } from '@beckn-ui/molecules'
import { Image, Box, Card, CardBody, Divider, Flex, useTheme } from '@chakra-ui/react'
import { IGeoLocationSearchPageRootState } from 'lib/types/geoLocationSearchPage'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { mockDataCab } from 'utilities/cabDetails'

const SearchRide = () => {
  const theme = useTheme()
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

  let totalCabs = 0

  mockDataCab.cabCategory.forEach(cabCategory => {
    totalCabs += cabCategory.mini.cabDetails.length
  })

  return (
    <Box>
      <MapWithNoSSR coords={coords} />
      <Box
        zIndex={'999'}
        position="absolute"
        top={'68px'}
        w="100%"
        background={'#fff'}
      >
        <Card
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
          </CardBody>
        </Card>
        <Box
          mt="20px"
          fontSize={'12px'}
          p="0 20px"
        >
          {totalCabs} results found
        </Box>
        {mockDataCab.cabCategory.map((cabCategory, index) => (
          <Box
            key={index}
            mb="20px"
            mt="20px"
            p="0 20px"
          >
            <Flex
              alignItems={'center'}
              mb="20px"
            >
              <Image
                src={cabCategory.image}
                alt={`${cabCategory.name} Cab`}
                mr="10px"
              />
              <Box>
                <Typography
                  text={cabCategory.name}
                  variant="subTitleSemibold"
                />
                <Typography
                  text={cabCategory.rating}
                  variant="subTitleSemibold"
                />
              </Box>
            </Flex>
            <Box
              overflowX={'scroll'}
              className="hideScroll"
            >
              <Flex width={'max-content'}>
                {cabCategory.mini.cabDetails.map((cabDetail, detailIndex) => (
                  <Card
                    key={detailIndex}
                    boxShadow=" 0px 8px 10px 0px #0000001A"
                    m="10px"
                    ml="unset"
                    width={'164px'}
                    height="206px"
                  >
                    <CardBody p={'10px'}>
                      <Box mb="10px">
                        <Image
                          src={cabDetail.image}
                          alt=""
                          margin={'0 auto'}
                        />
                        <Typography
                          text={cabDetail.name}
                          fontWeight="500"
                        />
                        <Typography
                          text={cabDetail.waitTime}
                          fontSize="11px"
                        />
                        <Typography
                          text={cabDetail.fare}
                          fontSize="15px"
                          color={theme.colors.primary[100]}
                        />
                      </Box>
                      <Button
                        text="Select"
                        variant="solid"
                        handleClick={() => Router.push('/searchRideForm')}
                      />
                    </CardBody>
                  </Card>
                ))}
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default SearchRide
