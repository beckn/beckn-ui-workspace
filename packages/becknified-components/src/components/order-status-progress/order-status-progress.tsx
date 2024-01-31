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
    <Flex>
      <Flex
        flexDirection={'column'}
        justifyContent="space-between"
        alignItems={'center'}
        pt="2px"
      >
        <Image
          alt="track-icon"
          width="18px"
          height="18px"
          src={TrackIcon}
        />
        <Image
          alt="line-icon"
          src={LineBlack}
          width="12px"
          height="60px"
        />
      </Flex>
      <Box>
        <Box pl={'10px'}>
          <Typography
            className={`${className}_order_state_text`}
            text={label}
            fontSize={'15px'}
            fontWeight={'500'}
          />
        </Box>

        <Box pl={'10px'}>
          <Typography
            className={`${className}_order_state_time`}
            fontSize="10px"
            text={statusTime}
          />
        </Box>
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
