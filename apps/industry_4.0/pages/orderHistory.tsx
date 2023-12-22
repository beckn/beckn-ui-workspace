import {
  OrderHistoryDetailsProps,
  OrderHistoryProps
} from '@beckn-ui/becknified-components/src/components/order-history/order-history.types'
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
import { OrderHistory as BecknOrderHistory } from '@beckn-ui/becknified-components'

const orderStatusMap = {
  INITIATED: 'pending',
  ACKNOWLEDGED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'outForDelivery',
  DELIVERED: 'completed'
}

const orderHistoryData: OrderHistoryDetailsProps[] = [
  {
    orderId: 'c5c44f4f-884a-4621-91f7-395829e100c2',
    orderState: 'pending',
    totalAmountWithSymbol: '₹ 250',
    quantity: 1,
    createdAt: 'Dec 12 2023, 18:05:41'
  },
  {
    orderId: 'c5c44f4f-884a-4621-91f7-395829e100c4',
    orderState: 'completed',
    totalAmountWithSymbol: '₹ 1230',
    quantity: 3,
    createdAt: 'Aug 12 2023, 18:05:41'
  },
  {
    orderId: 'c5c44f4f-884a-4621-91f7-395829e100c6',
    orderState: 'pending',
    totalAmountWithSymbol: '₹ 450',
    quantity: 2,
    createdAt: 'Dec 22 2023, 18:05:41'
  }
]

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

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <BecknOrderHistory
        schema={{
          orderHistoryDetails: orderHistoryData,
          loader: {
            text: 'Loading order history'
          }
        }}
        isLoading={loading}
        isEmptyText="No Orders Found"
      />
    </Box>
  )
}

export default OrderHistory
