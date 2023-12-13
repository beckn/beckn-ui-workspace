import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import LineBlack from '../../../public/images/lineBlack.svg'
import TrackIcon from '../../../public/images/TrackIcon.svg'
import { OrderStatusProgressProps } from './order-status-progress.types'

interface OrderStatusBoxProps {
  label: string
  statusTime: string
  className?: string
}

const OrderStatusBox: React.FC<OrderStatusBoxProps> = ({ label, statusTime, className }) => (
  <Box>
    <Flex
      className={className}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          width="12px"
          height="13px"
          src={TrackIcon}
        />
        <Box pl={'10px'}>
          <Typography
            className={`${className}_order_state_text`}
            text={label}
            fontSize={'15px'}
            fontWeight={'500'}
          />
        </Box>
      </Flex>
    </Flex>
    <Flex>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src={LineBlack}
        width="12px"
        height="40px"
      />
      <Box pl={'10px'}>
        <Typography
          className={`${className}_order_state_time`}
          fontSize="10px"
          text={statusTime}
        />
      </Box>
    </Flex>
  </Box>
)

const OrderStatusProgress: React.FC<OrderStatusProgressProps> = props => {
  const { orderState = '', orderStatusMap, statusTime = '', className = '' } = props

  const orderStates = Object.keys(orderStatusMap)
  const currentStateIndex = orderStates.indexOf(orderState)

  return (
    <>
      {orderStates.slice(0, currentStateIndex + 1).map((state, index) => (
        <OrderStatusBox
          key={index}
          label={orderStatusMap[state]}
          statusTime={statusTime}
          className={className}
        />
      ))}
    </>
  )
}

export default OrderStatusProgress
