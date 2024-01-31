import React from 'react'

// Custom modules
import { Loader } from '@beckn-ui/molecules'
import OrderHistoryDetails from './order-history-details'
import { OrderHistoryProps } from './order-history.types'

const OrderHistory: React.FC<OrderHistoryProps> = ({
  schema: { orderHistoryDetails, loader },
  isLoading = false,
  isEmptyText = 'No orders placed'
}) => {
  if (isLoading) {
    return <Loader {...loader} />
  }

  if (!orderHistoryDetails.length) {
    return <p>{isEmptyText}</p>
  }

  return (
    <>
      {orderHistoryDetails.map(orderInHistory => {
        return (
          <OrderHistoryDetails
            key={orderInHistory.orderId}
            {...orderInHistory}
          />
        )
      })}
    </>
  )
}

export default OrderHistory
