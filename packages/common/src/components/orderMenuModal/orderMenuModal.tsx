import React from 'react'
import { Box, Divider, Flex, Stack, Text, Image } from '@chakra-ui/react'
import { BottomModal, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { customerServiceMenuType, OrderMenuModalProps, OrderMenuType } from './orderMenuModal.types'

// Define menu items for the main menu
const menuItems = [
  {
    id: OrderMenuType.TRACK_ORDER,
    image: '/images/trackOrder.svg',
    text: 'Track Order',
    color: ''
  },
  {
    id: OrderMenuType.UPDATE_ORDER,
    image: '/images/updateOrder.svg',
    text: 'Update Order',
    color: ''
  },
  {
    id: OrderMenuType.CANCEL_ORDER,
    image: '/images/cancelOrder.svg',
    text: 'Cancel Order',
    color: '#E93324'
  }
]

// Define menu items for the call menu
const customerServiceMenuItem = [
  {
    id: customerServiceMenuType.CALL_SERVICE,
    image: '/images/callCustomer.svg',
    text: 'Call Customer Service'
  },
  {
    id: customerServiceMenuType.EMAIL_SERVICE,
    image: '/images/emailCustomer.svg',
    text: 'Email Customer Service'
  }
]

const OrderMenuModal = (props: OrderMenuModalProps) => {
  const { isOpen, onClose, isLoadingForTrackAndSupport, onMenuItemClick, onCustomerMenuItemClick, t } = props
  return (
    <BottomModal
      title=""
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoadingForTrackAndSupport ? (
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
          height={'300px'}
        >
          <LoaderWithMessage
            loadingText={t('pleaseWait')}
            loadingSubText={t('fetchingTrackLoaderSubtext')}
          />
        </Box>
      ) : (
        <Box>
          <Stack
            gap="20px"
            p={'20px 0px'}
          >
            {menuItems.map((menuItem, index) => (
              <Flex
                key={index}
                columnGap="10px"
                alignItems="center"
                onClick={() => onMenuItemClick(menuItem.id)}
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text as string}
                  color={menuItem.color}
                  fontSize="15px"
                  fontWeight={400}
                />
              </Flex>
            ))}
            <Divider />
            {customerServiceMenuItem.map((menuItem, index) => (
              <Flex
                key={index}
                columnGap="10px"
                alignItems="center"
                onClick={() => onCustomerMenuItemClick(menuItem.id)}
              >
                <Image src={menuItem.image} />
                <Text
                  as={Typography}
                  text={menuItem.text}
                  fontSize="15px"
                  fontWeight={400}
                />
              </Flex>
            ))}
          </Stack>
        </Box>
      )}
    </BottomModal>
  )
}

export default OrderMenuModal
