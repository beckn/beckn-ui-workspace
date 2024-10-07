import React from 'react'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import { GeoLocationType, PickUpDropOffModel, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch } from 'react-redux'
import { testIds } from '@shared/dataTestIds'

interface PickUpDropOffProps {
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
  handleClickOnSearchRides: () => void
}

const PickUpDropOff: React.FC<PickUpDropOffProps> = ({ pickup, dropoff, handleClickOnSearchRides }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch()

  const onFocusChange = (addressType: GeoLocationType) => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }

  return (
    <>
      <Box
        fontSize={'18px'}
        fontWeight="600"
        mb="20px"
      >
        Where Would You Like To Go?
      </Box>
      <Divider
        mb="20px"
        mr="-20px"
        ml="-20px"
        width={'unset'}
      />
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        alignItems={'center'}
        data-test={testIds.mobility_on_focus_pickup}
        onClick={() => onFocusChange('pick-up')}
      >
        <Image
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
        {!pickup?.address ? (
          <Box
            fontWeight="500"
            opacity={0.6}
            data-test={testIds.mobility_pickup_address}
          >
            Enter Pickup
          </Box>
        ) : (
          <Typography
            text={pickup?.address}
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
        )}
      </Flex>
      <Divider
        mb="20px"
        mt="20px"
      />
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        mb="40px"
        data-test={testIds.mobility_on_focus_dropoff}
        onClick={() => onFocusChange('drop-off')}
      >
        <Image
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
        {dropoff?.address ? (
          <Typography
            text={dropoff?.address}
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
        ) : (
          <Box
            fontWeight="500"
            opacity={0.6}
            data-test={testIds.mobility_dropoff_address}
          >
            Enter Destination
          </Box>
        )}
      </Flex>
      <BecknButton
        text="Search Rides"
        dataTest={testIds.mobility_search_btn}
        handleClick={handleClickOnSearchRides}
        disabled={dropoff?.address === '' || pickup?.address === ''}
      />
    </>
  )
}

export default PickUpDropOff
