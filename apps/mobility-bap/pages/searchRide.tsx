import TripLocation from '@/components/searchRideForm/TripLocation'
import { Button, Loader, Typography } from '@beckn-ui/molecules'
import { Image, Box, Card, CardBody, Divider, Flex, useTheme } from '@chakra-ui/react'
import axios from 'axios'
import { IGeoLocationSearchPageRootState } from 'lib/types/geoLocationSearchPage'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { discoveryActions } from 'store/discovery-slice'
import { ParsedCabDataModel, getSearchRidePayload, parsedSearchDetails } from 'utilities/cabDetails'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

const SearchRide = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [cabServiceProviders, setCabServiceProviders] = useState<ParsedCabDataModel[]>([])
  const [totalCabs, setTotalCabs] = useState<number>(0)

  const theme = useTheme()
  const dispatch = useDispatch()

  const pickup = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.pickup)
  const dropoff = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.dropoff)

  const searchRide = useCallback(() => {
    const payload = getSearchRidePayload(pickup, dropoff)

    setIsLoading(true)

    axios
      .post(`${apiUrl}/search`, payload)
      .then(async res => {
        const { providerDetails, totalCabs } = await parsedSearchDetails(res.data.data)
        setCabServiceProviders(providerDetails)
        setTotalCabs(totalCabs)
        setIsLoading(false)
      })
      .catch(e => {
        toast.error('Something went wrong, please try again', {
          position: 'top-center'
        })
        Router.push('/')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    searchRide()
  }, [])

  if (isLoading) {
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        transform="translateY(-10%)"
      >
        <Loader />
      </Box>
    )
  }

  return (
    <Box>
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
              pickupLocation={pickup.address}
              dropLocation={dropoff.address}
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
        {cabServiceProviders.map((provider, index) => (
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
                src={provider.image}
                alt={`${provider.name} Cab`}
                mr="10px"
              />
              <Box>
                <Typography
                  text={provider.name}
                  variant="subTitleSemibold"
                />
                <Typography
                  text={provider.rating}
                  variant="subTitleSemibold"
                />
              </Box>
            </Flex>
            <Box
              overflowX={'scroll'}
              className="hideScroll"
            >
              <Flex width={'max-content'}>
                {provider.cabDetails.map((cabDetail, detailIndex) => (
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
                        handleClick={() => {
                          // dispatch(
                          //   discoveryActions.addRide({
                          //     rideDetails: {
                          //       provider,
                          //       pickup,
                          //       dropoff
                          //     }
                          //   })
                          // )
                          Router.push('/searchRideForm')
                        }}
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
