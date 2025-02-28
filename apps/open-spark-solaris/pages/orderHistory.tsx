import Cookies from 'js-cookie'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import pendingIcon from '../public/images/pendingStatus.svg'
import { useDispatch } from 'react-redux'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { testIds } from '@shared/dataTestIds'
import { RENTAL_ORDER_CATEGORY_ID, RETAIL_ORDER_CATEGORY_ID } from '@lib/config'
import { OrderHistoryData } from '@lib/types/orderHistory'
import axios from '@services/axios'
import EmptyOrder from '@components/orderHistory/emptyOrder'

const orderStatusMap: Record<string, string> = {
  'In Review': 'Pending'
}

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<OrderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dispatch = useDispatch()
  const [error, setError] = useState('')

  const bearerToken = Cookies.get('authToken')
  const router = useRouter()
  console.log(bearerToken)
  useEffect(() => {
    axios
      .get(`${strapiUrl}/unified-beckn-energy/order-history/get?filters[category]=${RENTAL_ORDER_CATEGORY_ID}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      })
      // .then(response => response.json())
      .then(result => {
        setOrderHistoryList(result.data)

        setIsLoading(false)
      })
      .catch(error => {
        if (error) {
          return setError(error.message)
        }
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
        <Box
          mt={'23px'}
          cursor={'pointer'}
        >
          {orderHistoryList.map((order, idx) => {
            return (
              <DetailCard key={idx}>
                <Flex
                  data-test={testIds.order_history_main_container}
                  onClick={() => {
                    const orderObjectForStatusCall = {
                      bppId: order.bpp_id,
                      bppUri: order.bpp_uri,
                      orderId: order.order_id
                    }
                    localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
                    dispatch(orderActions.addSelectedOrder({ orderDetails: orderObjectForStatusCall }))
                    // router.push('/orderDetails')
                  }}
                  gap={'5px'}
                  flexDirection={'column'}
                >
                  <Flex
                    alignItems={'center'}
                    justifyContent="space-between"
                    cursor={'pointer'}
                    color="#228B22"
                  >
                    <Text
                      as={Typography}
                      text={`Placed at ${formatTimestamp(order.createdAt)}`}
                      fontWeight="400"
                      fontSize={'12px'}
                      dataTest={testIds.orderHistory_createdAt}
                    />
                    {/* <Text >Add to wallet</Text> */}
                    {/* <Text
                    color={'#228B22'}
                    fontSize={'10px'}
                    fontWeight="500"
                  >
                    Add to wallet
                  </Text> */}
                  </Flex>
                  <Text
                    as={Typography}
                    text={`Order ID: ${order.order_id}`}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_order_id}
                  />

                  <Text
                    as={Typography}
                    text={`${order.quote.price.currency} ${order.quote.price.value}`}
                    fontWeight="600"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_Price}
                  />

                  <Flex
                    fontSize={'10px'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Text
                      as={Typography}
                      text={`${order.items.length} Item${order.items.length > 1 ? 's' : ''}`}
                      fontWeight="400"
                      fontSize={'12px'}
                    />

                    <Flex>
                      <Image
                        src={pendingIcon}
                        paddingRight={'6px'}
                        data-test={testIds.orderHistory_pendingIcon}
                      />
                      {/* <Text>{orderStatusMap[order.delivery_status]}</Text> */}
                      <Text>{'Pending'}</Text>
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
