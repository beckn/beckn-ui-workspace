import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import Loader from '../components/loader/Loader'
import OrderHistoryDetails from '../components/orderHistory/OrderHistoryDetails'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import { getOrderPlacementTimeline } from '../utilities/confirm-utils'
import { getTotalPriceOfSingleOrder, getTotalQuantityOfSingleOrder } from '../utilities/orderHistory-utils'

const orderStatusMap = {
  INITIATED: 'pending',
  ACKNOWLEDGED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'outForDelivery',
  DELIVERED: 'completed'
}

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<any>([])
  const { data, fetchData, loading, error } = useRequest()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { t } = useLanguage()

  useEffect(() => {
    if (localStorage && localStorage.getItem('userPhone')) {
      fetchData(`${apiUrl}/client/v2/orders?userId=${localStorage.getItem('userPhone')}`, 'GET')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data) {
      const ordersArray = (data as any).orders
      localStorage.setItem('orderHistoryArray', JSON.stringify(ordersArray))
      setOrderHistoryList(ordersArray)
    }
  }, [data])

  if (loading) {
    return <Loader />
  }

  if (!orderHistoryList.length) {
    return <p>No orders placed</p>
  }

  return orderHistoryList.map((orderInHistory: any, index: number) => {
    const createdAt = getOrderPlacementTimeline(
      orderInHistory.orders.length > 0 ? orderInHistory.orders[0].message.responses[0].message.order.created_at : ''
    )

    const totalQuantityOfSingleOrder = getTotalQuantityOfSingleOrder(orderInHistory.orders)
    const totalPriceOfSingleOrder = getTotalPriceOfSingleOrder(orderInHistory.orders)
    const orderState = orderInHistory.orders[0].message.responses[0].message.order.state

    return (
      <Link
        legacyBehavior
        key={index}
        href={{
          pathname: '/orderDetails',
          query: { orderId: orderInHistory.parentOrderId }
        }}
      >
        <Box pt={'20px'}>
          <DetailsCard>
            <OrderHistoryDetails
              createdAt={createdAt}
              orderId={orderInHistory.parentOrderId}
              quantity={totalQuantityOfSingleOrder}
              totalAmount={totalPriceOfSingleOrder}
              orderState={t[`${orderStatusMap[orderState]}`]}
            />
          </DetailsCard>
        </Box>
      </Link>
    )
  })
}

export default OrderHistory
