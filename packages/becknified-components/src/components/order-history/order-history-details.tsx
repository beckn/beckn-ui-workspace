import React from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'

// Custom modules
import pendingIcon from '../../../public/images/pending.svg'
import completedIcon from '../../../public/images/completed.svg'
import { OrderHistoryDetailsProps } from './order-history.types'
import DetailCard from '../detail-card'
import { Typography } from '@beckn-ui/molecules'

const OrderHistoryDetails: React.FC<OrderHistoryDetailsProps> = props => {
  return (
    <Box
      pt="20px"
      onClick={props.onClick}
    >
      <DetailCard>
        <Box>
          <Typography
            variant="tagRegular"
            style={{ paddingBottom: '5px' }}
            text={`Placed at ${props.createdAt}`}
          />
          <Typography
            variant="subTextSemibold"
            text={`Order Details Id ${props.orderId}`}
            style={{ paddingBottom: '5px' }}
          />
          <Typography
            style={{ paddingBottom: '5px' }}
            text="Order in progress"
            variant="tagSemibold"
          />
          <Typography
            style={{ paddingBottom: '5px' }}
            text={props.totalAmountWithSymbol}
            variant="subTextSemibold"
          />
          <Flex
            fontSize={'10px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography text={`${props.quantity} items`} />
            <Flex>
              <Image
                src={props.orderState === 'completed' || props.orderState === 'Complété' ? completedIcon : pendingIcon}
                paddingRight={'6px'}
              />
              <Typography text={props.orderState} />
            </Flex>
          </Flex>
        </Box>
      </DetailCard>
    </Box>
  )
}

export default OrderHistoryDetails
