import Cookies from 'js-cookie'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import pendingIcon from '../public/images/pendingStatus.svg'
import { orderHistoryData } from '../types/order-history.types'
import { orderActions } from '@store/order-slice'
import { useDispatch } from 'react-redux'
import { formatTimestamp } from '@utils/confirm-utils'
import { useRouter } from 'next/router'
import EmptyOrder from '@components/orderHistory/emptyOrder'

const orderStatusMap: Record<string, string> = {
  'In Review': 'Pending'
}

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dispatch = useDispatch()
  const [error, setError] = useState('')

  const bearerToken = Cookies.get('authToken')
  const router = useRouter()

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/orders?filters[category]=6`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('resluttt', result)
        if (result.error) {
          return setError(result.error.message)
        }
        setOrderHistoryList(result.data.reverse())
        setIsLoading(false)
      })
      .catch(error => {
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
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
    >
      {!orderHistoryList.length ? (
        <EmptyOrder />
      ) : (
        <Box mt={'23px'}>
          {orderHistoryList.map((order, idx) => {
            return (
              <DetailCard key={idx}>
                <Flex
                  onClick={() => {
                    const orderObjectForStatusCall = {
                      bppId: order.attributes.bpp_id,
                      bppUri: order.attributes.bpp_uri,
                      orderId: order.attributes.order_id
                    }
                    localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
                    dispatch(orderActions.addSelectedOrder({ orderDetails: orderObjectForStatusCall }))
                    router.push('/orderDetails')
                  }}
                  gap={'5px'}
                  flexDirection={'column'}
                >
                  <Text
                    as={Typography}
                    text={`Placed at ${formatTimestamp(order.attributes.createdAt)}`}
                    fontWeight="400"
                    fontSize={'12px'}
                  />

                  <Text
                    as={Typography}
                    text={`Order ID: ${order.attributes.order_id}`}
                    fontWeight="400"
                    fontSize={'12px'}
                  />

                  <Text
                    as={Typography}
                    text={`${order.attributes.quote.price.currency} ${order.attributes.quote.price.value}`}
                    fontWeight="600"
                    fontSize={'12px'}
                  />

                  <Flex
                    fontSize={'10px'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Text
                      as={Typography}
                      text={'1 Item'}
                      fontWeight="400"
                      fontSize={'12px'}
                    />

                    <Flex>
                      <Image
                        src={pendingIcon}
                        paddingRight={'6px'}
                      />
                      <Text>{orderStatusMap[order.attributes.delivery_status]}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </DetailCard>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default OrderHistory
