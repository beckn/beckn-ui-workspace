import OrderOverview, { mapOrderData, OrderItem } from '@components/orderOverview/OrderOverview'
import Cookies from 'js-cookie'
import { Loader } from '@beckn-ui/molecules'
import { Box, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { RENTAL_ORDER_CATEGORY_ID } from '@lib/config'
import EmptyOrder from '@components/orderHistory/emptyOrder'

const MyRental = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [error, setError] = useState('')

  const bearerToken = Cookies.get('authToken')

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(
      `${strapiUrl}/unified-beckn-energy/order-history/get?filters[category]=${RENTAL_ORDER_CATEGORY_ID}`,
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          return setError(result.error.message)
        } else {
          const mappedData = mapOrderData(result) // Transform data
          setOrderHistoryList(mappedData)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader />
      </Box>
    )
  }

  if (error.length) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Text
          fontWeight={500}
          fontSize={'15px'}
          textAlign={'center'}
        >
          {error}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      maxH="calc(100vh - 110px)"
      overflowY="scroll"
      className="hideScroll"
    >
      {!orderHistoryList.length ? (
        <EmptyOrder />
      ) : (
        <OrderOverview
          items={orderHistoryList}
          showPriceAndStatus={true}
        />
      )}
    </Box>
  )
}

export default MyRental
