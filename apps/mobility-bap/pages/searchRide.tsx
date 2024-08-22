import TripLocation from '@components/searchRideForm/TripLocation'
import { Button, Typography } from '@beckn-ui/molecules'
import { Image, Box, Card, CardBody, Divider, Flex, useTheme } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { discoveryActions } from '@store/discovery-slice'
import { UserGeoLocationRootState } from '@lib/types/user'
import { useLanguage } from '@hooks/useLanguage'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import { StarIcon } from '@chakra-ui/icons'
import { getCurrencyValue, getDistance } from '@utils/general'

const SearchRide = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const { pickup, dropoff, experienceType } = useSelector((state: UserGeoLocationRootState) => state.userInfo)
  const { cabServiceProviders, totalCabs } = useSelector((state: CabServiceDetailsRootState) => state.cabService)

  const handleOnSelect = useCallback((transactionId: string, details: any) => {
    dispatch(discoveryActions.addTransactionId({ transactionId }))
    dispatch(
      discoveryActions.addRide({
        rideDetails: details
      })
    )

    Router.push({
      pathname: '/',
      query: { fromSearchRide: true }
    })
  }, [])

  // if (isLoading) {
  //   return (
  //     <Box
  //       display="flex"
  //       height="100vh"
  //       justifyContent="center"
  //       transform="translateY(-10%)"
  //     >
  //       <Loader />
  //     </Box>
  //   )
  // }

  const getTotalFare = (fare: string) => {
    const distance = getDistance(pickup, dropoff)
    return (Number(fare) * distance).toFixed(2)
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
              pickupLocation={pickup}
              dropLocation={dropoff}
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
                src={'./images/olaCab.svg'} // provider.image ||
                alt={`${provider.providerName} Cab`}
                mr="10px"
              />
              <Box>
                <Typography
                  text={provider.providerName}
                  variant="subTitleSemibold"
                />
                <Flex
                  alignItems={'center'}
                  gap={'4px'}
                  mt={'5px'}
                >
                  <Typography
                    text={provider.rating}
                    variant="subTitleSemibold"
                  />
                  <StarIcon
                    color={'#FADB14'}
                    w={'12px'}
                    h={'12px'}
                    mb={'2px'}
                  />
                </Flex>
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
                          text={`${getCurrencyValue(experienceType)}${getTotalFare(cabDetail.fare)}`}
                          fontSize="15px"
                          color={theme.colors.primary[100]}
                        />
                      </Box>
                      <Button
                        text="Select"
                        variant="solid"
                        handleClick={() =>
                          handleOnSelect(provider.transactionId, {
                            provider,
                            pickup,
                            dropoff
                          })
                        }
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
