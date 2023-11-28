import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { getOrderPlacementTimeline } from '../../utilities/confirm-utils'
import lineBlack from '../../public/images/lineBlack.svg'
import TrackIcon from '../../public/images/TrackIcon.svg'
import { useLanguage } from '../../hooks/useLanguage'

const orderStatusMap = {
  INITIATED: 'confirmationPending',
  ACKNOWLEDGED: 'itemsConfirmed',
  PACKED: 'orderPacked',
  SHIPPED: 'outForDelivery',
  DELIVERED: 'orderDelivered'
}

export const orderCardStatusMap = {
  INITIATED: 'pending',
  ACKNOWLEDGED: 'confirmed',
  PACKED: 'confirmed',
  SHIPPED: 'confirmed',
  DELIVERED: 'delivered'
}

export const RenderOrderStatusList = (res: any) => {
  const order = res.scholarshipProviders[0].scholarships[0].scholarshipDetails
  const { t } = useLanguage()

  if (order.state.code === 'arbitration-in-progress') {
    return (
      <Box mb={'10px'}>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Flex alignItems={'center'}>
            <Image
              width={'12px'}
              height={'13px'}
              src={TrackIcon}
            />
            <Text
              paddingLeft={'10px'}
              fontSize={'15px'}
              fontWeight={'600'}
            >
              Case Submitted
            </Text>
          </Flex>
          {/* {true && (
            <Text
              fontSize={'15px'}
              color={'rgba(var(--color-primary))'}
            >
              Track
            </Text>
          )} */}
        </Flex>
        <Flex>
          <Image
            src={lineBlack}
            width={'12px'}
            height={'40px'}
          />
          <Text
            mt={'5px'}
            paddingLeft={'10px'}
            fontSize={'10px'}
          >
            <Text fontSize={'12px'}>Adv. Vishal Singh, 9832445890</Text>
            <Text
              fontSize={'12px'}
              color={'#7B2A2F'}
            >
              Provider Link
            </Text>
            {getOrderPlacementTimeline(order.state.updatedAt)}
          </Text>
        </Flex>
      </Box>
    )
  }
  if (order.state.code === 'partial-payment') {
    return (
      <>
        <Box mb={'10px'}>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'}>
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                paddingLeft={'10px'}
                fontSize={'15px'}
                fontWeight={'600'}
              >
                Case Submitted
              </Text>
            </Flex>
            {/* {true && (
            <Text
              fontSize={'15px'}
              color={'rgba(var(--color-primary))'}
            >
              Track
            </Text>
          )} */}
          </Flex>
          <Flex>
            <Image
              src={lineBlack}
              width={'12px'}
              height={'40px'}
            />
            <Text
              marginTop={'5px'}
              paddingLeft={'10px'}
              fontSize={'10px'}
            >
              <Text fontSize={'12px'}>Adv. Vishal Singh, 9832445890</Text>
              <Text
                fontSize={'12px'}
                color={'#7B2A2F'}
              >
                Provider Link
              </Text>
              {getOrderPlacementTimeline(order.state.updatedAt)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                paddingLeft={'10px'}
                fontSize={'15px'}
                fontWeight={'600'}
              >
                Case in Progress
              </Text>
            </Flex>
          </Flex>
          <Flex>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={lineBlack}
              width={'12px'}
              height={'40px'}
            />
            <Text
              paddingLeft={'10px'}
              fontSize={'10px'}
            >
              {getOrderPlacementTimeline(order.state.updatedAt)}
            </Text>
          </Flex>
        </Box>
      </>
    )
  }
  if (order.state.code === 'arbitration-completed') {
    return (
      <>
        <Box mb={'10px'}>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'}>
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                paddingLeft={'10px'}
                fontSize={'15px'}
                fontWeight={'600'}
              >
                Case Submitted
              </Text>
            </Flex>
          </Flex>
          <Flex>
            <Image
              src={lineBlack}
              width={'12px'}
              height={'40px'}
            />
            <Text
              mt={'5px'}
              paddingLeft={'10px'}
              fontSize={'10px'}
            >
              <Text fontSize={'12px'}>Adv. Vishal Singh, 9832445890</Text>
              <Text
                fontSize={'12px'}
                color={'#7B2A2F'}
              >
                Provider Link
              </Text>
              {getOrderPlacementTimeline(order.state.updatedAt)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                paddingLeft={'10px'}
                fontSize={'15px'}
                fontWeight={'600'}
              >
                Case in Progress
              </Text>
            </Flex>
          </Flex>
          <Flex>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={lineBlack}
              width={'12px'}
              height={'40px'}
            />
            <Text
              paddingLeft={'10px'}
              fontSize={'10px'}
            >
              {getOrderPlacementTimeline(order.state.updatedAt)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Flex
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Flex alignItems={'center'}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                width={'12px'}
                height={'13px'}
                src={TrackIcon}
              />
              <Text
                paddingLeft={'10px'}
                fontSize={'15px'}
                fontWeight={'600'}
              >
                Dispute Resolved
              </Text>
            </Flex>
          </Flex>
          <Flex>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={lineBlack}
              width={'12px'}
              height={'40px'}
            />
            <Text
              paddingLeft={'10px'}
              fontSize={'10px'}
            >
              {getOrderPlacementTimeline(order.state.updatedAt)}
            </Text>
          </Flex>
        </Box>
      </>
    )
  }
}
