import { Button, Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { RideSummaryProps } from '../../lib/types/rideDetails'
import Styles from '@beckn-ui/becknified-components/src/pages/auth/auth.module.css'
import { RIDE_STATUS_CODE } from '@utils/ride-utils'

const RideSummary: React.FC<RideSummaryProps> = ({
  time,
  date,
  distance,
  source,
  destination,
  buttons,
  handleNavigate,
  fare,
  driverStatus,
  sourceGps,
  destinationGps
}) => {
  return (
    <Box>
      <Flex
        mb={'16px'}
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            style={{ paddingRight: '15px' }}
            text={`${time!} min away`}
            color="#676767"
          />
          <Box
            w="6px"
            h="6px"
            borderRadius={'50%'}
            bg="#DBDBDB"
            mr="10px"
          ></Box>
          <Typography
            text={`${distance!} Kms`}
            color="#676767"
          />
        </Flex>
        {handleNavigate && (
          <Flex
            bg={'#ABD4FA'}
            p="2px 6px"
            borderRadius={'6px'}
            onClick={() => {
              console.log(driverStatus)
              if (driverStatus === RIDE_STATUS_CODE.RIDE_ACCEPTED) {
                handleNavigate?.(sourceGps!)
              }
              if (driverStatus === RIDE_STATUS_CODE.CAB_REACHED_PICKUP_LOCATION) {
                handleNavigate?.(destinationGps!, false)
              }
              console.log(driverStatus, destinationGps)
              if (driverStatus === RIDE_STATUS_CODE.RIDE_STARTED || driverStatus === RIDE_STATUS_CODE.RIDE_COMPLETED) {
                handleNavigate?.(destinationGps!)
              }
            }}
          >
            <Image
              src="/images/near_me.svg"
              alt="near_me"
              mr="5px"
            />
            <Typography text="Navigate" />
          </Flex>
        )}
        {date && (
          <Typography
            text={date}
            color="#676767"
          />
        )}
      </Flex>
      <Flex
        mb={destination ? '16px' : '30px'}
        alignItems="center"
      >
        <Image
          src="/images/pickUpIcon.svg"
          alt="pickUpIcon"
          mr="10px"
        />
        <Typography text={source} />
      </Flex>
      {destination && (
        <Flex
          mb={fare ? '16px' : '30px'}
          alignItems="center"
        >
          <Image
            src="/images/destinationIcon.svg"
            alt="destinationIcon"
            mr="10px"
          />
          <Typography text={destination} />
        </Flex>
      )}
      {fare && (
        <Box
          color={'#676767'}
          mb="20px"
        >
          <Divider
            borderBottomWidth="0px"
            padding={'4px'}
            backgroundImage="linear-gradient(to right, #00000033 0 50%, transparent 50% 100%)"
            backgroundRepeat={'repeat no-repeat'}
            backgroundSize="6% 1px"
            ml="-20px"
            mr="-20px"
            w={'unset'}
          />
          <Typography
            color="#676767"
            text={fare.text}
            style={{ marginTop: '12px' }}
          />
          <Flex alignItems={'center'}>
            <Image
              src="/images/rupees.svg"
              alt="rupee"
              mr={'8px'}
            />
            <Typography
              text={fare.cost}
              fontSize="24px"
              color="#34C759"
              fontWeight="600"
            />
          </Flex>
        </Box>
      )}
      {buttons.map(singleButton => {
        return (
          <Button
            className={`${Styles.auth_btn} ${singleButton.className}`}
            key={singleButton.text}
            {...singleButton}
          />
        )
      })}
    </Box>
  )
}

export default RideSummary
