import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import LineBlack from '../../../public/images/lineBlack.svg'
import TrackIcon from '../../../public/images/TrackIcon.svg'
import PendingIcon from '../../../public/images/pendingStatus.svg'
import { OrderStatusProgressProps } from './order-status-progress.types'

const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({
  label,
  statusTime,
  className = '',
  noLine = false,
  statusIcon,
  lastElement,
  statusDescription,
  dataTestStateName = 'statusName',
  dataTestStateTime = 'statusTime',
  dataTestStateDescription = 'statusDescription'
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
            src={statusIcon || TrackIcon}
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
              dataTest={dataTestStateName}
              fontSize={'15px'}
              fontWeight={'500'}
            />
          </Box>

          {statusDescription && (
            <Box pl={'10px'}>
              <Typography
                className={`${className}_order_state_label`}
                fontSize="10px"
                dataTest={dataTestStateDescription}
                text={statusDescription}
              />
            </Box>
          )}

          <Box pl={'10px'}>
            <Typography
              className={`${className}_order_state_time`}
              fontSize="10px"
              dataTest={dataTestStateTime}
              text={statusTime}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

export default OrderStatusProgress
