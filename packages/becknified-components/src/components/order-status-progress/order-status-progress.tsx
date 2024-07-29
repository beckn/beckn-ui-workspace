import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import LineBlack from '../../../public/images/lineBlack.svg'
import TrackIcon from '../../../public/images/TrackIcon.svg'
import { OrderStatusProgressProps } from './order-status-progress.types'
import { testIds } from '@shared/dataTestIds'

const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({
  label,
  statusTime,
  className = '',
  noLine = false,
  lastElement
}) => {
  const showNoLine = noLine && lastElement
  return (
    <Box>
      <Flex>
        <Flex
          flexDirection={'column'}
          justifyContent="space-between"
          alignItems={'center'}
        >
          <Image
            alt="track-icon"
            maxW={'unset'}
            width="18px"
            height="18px"
            src={TrackIcon}
          />
          {!showNoLine && (
            <Image
              alt={'line-icon'}
              src={LineBlack}
              width="12px"
              height="60px"
            />
          )}
        </Flex>
        <Box>
          <Box pl={'10px'}>
            <Typography
              style={{
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box'
              }}
              className={`${className}_order_state_text`}
              text={label}
              dataTest={testIds.orderDetailspage_orderStateName}
              fontSize={'15px'}
              fontWeight={'500'}
            />
          </Box>

          <Box pl={'10px'}>
            <Typography
              className={`${className}_order_state_time`}
              fontSize="10px"
              dataTest={testIds.orderDetailspage_orderStateTime}
              text={statusTime}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

export default OrderStatusProgress
