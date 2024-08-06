import React from 'react'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import { GeoLocationType, PickUpDropOffModel, toggleLocationSearchPageVisibility } from '@beckn-ui/common'
import { BottomModal } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch } from 'react-redux'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  pickup: PickUpDropOffModel
  dropoff: PickUpDropOffModel
  handleClickOnSearchRides: () => void
}

const PickUpDropOffModal: React.FC<ModalProps> = ({ isOpen, onClose, pickup, dropoff, handleClickOnSearchRides }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch()

  const onFocusChange = (addressType: GeoLocationType) => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType }))
  }

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={() => {}}
      divider="DASHED"
      backgroundAccessControl={true}
    >
      <Box
        fontSize={'18px'}
        fontWeight="600"
        mb="20px"
      >
        Where Would You Like To Go?
      </Box>
      <Divider mb="20px" />
      <Flex
        fontSize={'15px'}
        fontWeight="500"
        alignItems={'center'}
        onClick={() => onFocusChange('pick-up')}
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
        {!pickup?.address ? (
          <Box
            fontWeight="500"
            opacity={0.6}
          >
            Enter Pickup
          </Box>
        ) : (
          <Box
            fontWeight="600"
            whiteSpace={'nowrap'}
            overflow="hidden"
            textOverflow={'ellipsis'}
          >
            {pickup?.address}
          </Box>
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
        onClick={() => onFocusChange('drop-off')}
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
        {dropoff?.address ? (
          <Box
            fontWeight="600"
            whiteSpace={'nowrap'}
            overflow="hidden"
            textOverflow={'ellipsis'}
          >
            {dropoff.address}
          </Box>
        ) : (
          <Box
            fontWeight="500"
            opacity={0.6}
          >
            Enter Destination
          </Box>
        )}
      </Flex>
      <BecknButton
        text="Search Rides"
        handleClick={handleClickOnSearchRides}
        disabled={dropoff?.address === '' || pickup?.address === ''}
      />
    </BottomModal>
  )
}

export default PickUpDropOffModal
