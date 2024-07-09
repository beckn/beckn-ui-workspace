import { DetailCard, OrderStatusProgress, OrderStatusProgressProps } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, CardBody, Flex, Text, Image, Divider, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Item, QuantityDetails } from '../../../../lib/types'
import { OrdersRootState } from '../../../store/order-slice'
import { formatTimestamp } from '../../../utils'
import { OrderData, ProgressSummaryProps } from '../orderDetails.types'
import ViewMoreOrderModal from './ViewMoreOrder'

const ProgressSummary = (props: ProgressSummaryProps) => {
  const { t, orderData, orderStatusMap, isDelivered, isCancelled, currencyMap, handleOpenOrderMenu } = props

  const { isOpen, onOpen, onClose } = useDisclosure()
  const orderMetaData = useSelector((state: OrdersRootState) => state.orders.selectedOrderDetails)

  const totalQuantityOfOrder = (data: OrderData) => {
    let count = 0
    data.items!.forEach((item: Item) => {
      count += (item.quantity as QuantityDetails)?.selected?.count
    })
    return count
  }

  return (
    <>
      {/* Display progress summary */}
      <Box
        pb="15px"
        pt="20px"
      >
        <Typography
          variant="subTitleRegular"
          text={t('progressSummary')}
          fontSize="17px"
        />
      </Box>

      {/* Display order status details */}
      <DetailCard>
        <CardBody p={'unset'}>
          <>
            <Flex
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                as={Typography}
                // TODO
                text={`Order Id: ${orderMetaData.orderIds[0].slice(0, 5)}...`}
                fontSize="17px"
                fontWeight="600"
              />
              <Image
                onClick={handleOpenOrderMenu}
                src="/images/threeDots.svg"
                alt="threeDots"
              />
            </Flex>

            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Flex maxWidth={'57vw'}>
                <Text
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  whiteSpace={'nowrap'}
                  fontSize={'12px'}
                  fontWeight={'400'}
                >
                  {orderData.name}
                </Text>
                {totalQuantityOfOrder(orderData) > 1 && (
                  <Text
                    pl={'5px'}
                    color={'green'}
                    fontSize={'12px'}
                    fontWeight={'600'}
                    onClick={onOpen}
                  >
                    +{totalQuantityOfOrder(orderData) - 1}
                  </Text>
                )}
              </Flex>

              <Text
                fontSize={'15px'}
                fontWeight={'500'}
                color={orderData.status === 'CANCELLED' ? 'red' : 'green'}
              >
                {orderData.status}
              </Text>
            </Flex>
          </>
          <Divider
            mr={'-20px'}
            ml="-20px"
            width={'unset'}
            pt="15px"
          />
          <ViewMoreOrderModal
            t={t}
            currencyMap={currencyMap}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            items={orderData.items!}
            orderId={`${orderMetaData.orderIds[0].slice(0, 5)}...`}
          />

          {/* Display order status progress */}
          <Box className="order_status_progress">
            {orderStatusMap.map((status: OrderStatusProgressProps, index: number) => (
              <OrderStatusProgress
                key={index}
                label={status.label}
                statusTime={status.statusTime && formatTimestamp(status.statusTime)}
                noLine={isDelivered || isCancelled}
                lastElement={orderStatusMap.length - 1 === index}
              />
            ))}
          </Box>
        </CardBody>
      </DetailCard>
    </>
  )
}

export default ProgressSummary
